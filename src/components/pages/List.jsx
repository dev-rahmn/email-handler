import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

import Swal from "sweetalert2";

// Animation variants
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, when: "beforeChildren" } },
};
const listItemVariants = {
  hidden: { opacity: 0, x: 10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
};
const previewPanelVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: 50, transition: { duration: 0.3 } },
};

// Variants for list container animation
const listDataItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};

// Simulated APIs
const staticBlockedEmails = [
  "Sophie_DuBuque67@yahoo.com",
  "Elias.Reichel@gmail.com",
  "ivian.Schimmel85@yahoo.com",
];
// const removeDuplicatesAPI = (emails) =>
//   new Promise((resolve) =>
//     setTimeout(() => {
//       const seen = new Set();
//       const unique = [];
//       const duplicates = [];
//       emails.forEach((email) => {
//         if (seen.has(email)) duplicates.push(email);
//         else {
//           seen.add(email);
//           unique.push(email);
//         }
//       });
//       resolve({ unique, duplicates });
//     }, 5000)
//   );
// const filterBlockedAPI = (emails) =>
//   new Promise((resolve) =>
//     setTimeout(() => {
//       const allowed = [];
//       const blocked = [];
//       emails.forEach((email) => {
//         if (staticBlockedEmails.includes(email)) blocked.push(email);
//         else allowed.push(email);
//       });
//       resolve({ allowed, blocked });
//     }, 5000)
//   );
const simulateProgress = (start, end, duration, update) =>
  new Promise((resolve) => {
    const range = end - start;
    const step = duration / range;
    let curr = start;
    const id = setInterval(() => {
      curr++;
      update(curr);
      if (curr >= end) {
        clearInterval(id);
        resolve();
      }
    }, step);
  });

const List = () => {
  // STATE
  const [lists, setLists] = useState([]);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [listName, setListName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState("");
  const [mode, setMode] = useState(null); // 'new' | 'preview' | 'edit'
  const [editingIndex, setEditingIndex] = useState(null);
  const [cellEditor, setCellEditor] = useState({
    open: false,
    row: null,
    col: null,
    value: "",
  });
  // Reporting states
  const [duplicateEmails, setDuplicateEmails] = useState([]);
  const [blockedEmails, setBlockedEmails] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("mySavedLists");
    stored !== null ? setLists(JSON.parse(stored)) : setLists([]);
  }, []);
  useEffect(() => {
    const stored = localStorage.getItem("mySavedLists");
    
      if (lists.length > 0) {
        localStorage.setItem("mySavedLists", JSON.stringify(lists));
      
    }
  }, [lists]);

  // CSV processing, filtering out any 'id' column
  const processCSV = async (file) => {
    try {
      setIsProcessing(true);
      setProgress(0);
      setProcessingStep("Reading CSV...");
  
      const text = await file.text();
      const lines = text.trim().split(/\r?\n/);
      const headers = lines[0].split(",").map(h => h.trim());
      setHeaders(headers.filter(h => h.toLowerCase() !== 'id'));
  
      const emailIdx = headers.findIndex(h => h.toLowerCase() === 'email');
      if (emailIdx < 0) throw new Error("No 'Email' column found");
  
      // Parse rows into objects
      const rows = lines.slice(1).map(line => {
        const vals = line.split(",");
        return headers.reduce((obj, header, i) => ({
          ...obj,
          [header]: (vals[i] || '').trim(),
        }), {});
      });
  
      // Initialize trackers
      const blockedSet = new Set(staticBlockedEmails.map(e => e.toLowerCase()));
      const seen = new Set();
      const uniqueRows = [];
      const duplicateEmails = [];
      const blockedEmails = [];
  
      setProcessingStep("Filtering duplicates & blocked emails...");
  
      // Single-pass: remove duplicates and blocked
      for (const row of rows) {
        const rawEmail = row[headers[emailIdx]];
        const normalized = rawEmail.toLowerCase();
  
        if (blockedSet.has(normalized)) {
          blockedEmails.push(rawEmail);
          continue;
        }
        if (seen.has(normalized)) {
          duplicateEmails.push(rawEmail);
          continue;
        }
        seen.add(normalized);
        uniqueRows.push(row);
      }
  
      // Phase 1: show “Filtering duplicates…” from 0 → 50%
    setProcessingStep("Filtering duplicates...");
    await simulateProgress(0, 50, 1500, setProgress);

    // Phase 2: show “Filtering blocked emails…” from 50 → 100%
    setProcessingStep("Filtering blocked emails...");
    await simulateProgress(50, 100, 1500, setProgress);

      // Update state
      setDuplicateEmails(duplicateEmails);
      setBlockedEmails(blockedEmails);
      setPreviewData(uniqueRows);
      setSelectedFile(file);
      setMode("new");
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setProcessingStep("Done!");
      
      setTimeout(() => setIsProcessing(false), 100);
    }
  };

  // CSV handlers
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    handleClearCSV();
    if (f?.type === "text/csv") processCSV(f);
    else alert("Please select a valid .csv file.");
  };
  const handleClearCSV = () => {
    setSelectedFile(null);
    setPreviewData([]);
    setHeaders([]);
    setDuplicateEmails([]);
    setBlockedEmails([]);
    setListName("");
    setMode(null);
    fileInputRef.current.value = "";
  };

  // List actions
  const handleCreateClick = () => setShowNamePrompt(true);
  const handleSaveList = () => {
    if (!listName.trim()) return alert("Enter a list name.");
    setLists((prev) => [...prev, {
      name: listName,
      data: previewData,
      duplicates: duplicateEmails,
      blocked: blockedEmails,
    }]);
    setShowNamePrompt(false);
    setListName("");
    handleClearCSV();
  };
  const handlePreviewList = (idx) => {
    const lst = lists[idx];
    setSelectedFile({ name: lst.name });
    // filter out id column if existing data had it
    const filteredCols = Object.keys(lst.data[0] || {}).filter(
      (h) => h.trim().toLowerCase() !== "id"
    );
    setHeaders(filteredCols);
    setPreviewData(lst.data);
    setDuplicateEmails(lst.duplicates);
    setBlockedEmails(lst.blocked);
    
    setMode("preview");
    setEditingIndex(idx);
  };
  const handleEditList = (idx) => {
    const lst = lists[idx];
    setListName(lst.name);
    setSelectedFile({ name: lst.name });
    const filteredCols = Object.keys(lst.data[0] || {}).filter(
      (h) => h.trim().toLowerCase() !== "id"
    );
    setHeaders(filteredCols);
    setPreviewData(lst.data);
    setMode("edit");
    setEditingIndex(idx);
  };
  const handleDeleteList = (idx) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the list.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const cp = [...lists];
        cp.splice(idx, 1);
        setLists(cp);
        handleClearCSV();
        Swal.fire("Deleted!", "Your list has been deleted.", "success");
      }
    });
  };
  const handleCancel = () => {
    handleClearCSV();
    setEditingIndex(null);
  };
  const handleSaveChanges = () => {
    if (!listName.trim()) return alert("Enter a list name.");
    const cp = [...lists];
    cp[editingIndex] = { name: listName, data: previewData };
    setLists(cp);
    setListName("");
    handleCancel();
  };

  // Cell editor handlers
  const handleCellClick = (row, col) => {
    if (!(mode === "edit" || mode === "new")) return;
    setCellEditor({ open: true, row, col, value: previewData[row][col] });
  };
  /**
   * Handles updating a cell in the preview data after the cell editor is confirmed.
   * @param {number} row - Row index of the cell.
   * @param {string} col - Column name of the cell.
   * @param {string} value - New value of the cell.
   */
  const handleCellUpdate = () => {

    const { row, col, value } = cellEditor;

    const cp = [...previewData];
    cp[row] = { ...cp[row], [col]: value };
    setPreviewData(cp);
    setCellEditor({ open: false, row: null, col: null, value: "" });
  };

  return (
    <div className="relative min-h-screen bg-lightGrey">
      <div className="relative z-10 px-6 pt-20">
        {/* Header & Import */}
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold text-white"
          >
            List
          </motion.h1>
          <div>
            <label
              htmlFor="file-upload"
              className="px-7 py-2 bg-darkGrey text-white rounded-lg cursor-pointer  shadow-lightOrange"
            >
              Import CSV
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-4">
          {/* Saved Lists */}
          <div
            className="bg-white rounded-lg py-6 md:w-1/3 w-full overflow-auto max-h-[80vh] min-h-[80vh] shadow-lg
             "
            style={{ scrollbarWidth: "thin", scrollbarColor: "lightCyan darkCyan" }}
          >
            <h2 className="text-2xl font-semibold mb-4 mx-2">Your Lists</h2>
            {lists?.length === 0 ? (
              <p className="text-lightGrey mx-6">No lists yet.</p>
            ) : (
              <AnimatePresence>
                {lists?.map((lst, idx) => (
                  <motion.div
                    key={idx}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={listDataItemVariants}
                    className="mb-2"
                  >
                    <Disclosure  className="rounded-lg bg-darkGrey divide-y divide-lightGrey mx-2 my-4 border-2 border-darkGrey shadow-inner">
                      {({ open }) => (
                        <div key={ idx}>
                          <Disclosure.Button className="w-full p-3 bg-ultraLightGreen rounded shadow flex justify-between items-center focus:outline-none">
                            <span className="font-medium">{lst.name}</span>
                            <ChevronUpIcon
                              className={`text-white ${
                                open ? 'transform rotate-180' : ''
                              } w-6 h-6 text-gray-500 transition-transform duration-200`}
                            />
                          </Disclosure.Button>
                             
                      <Disclosure.Panel className="p-2 bg-darkGrey rounded-b shadow-inner flex space-x-2">
                        <button
                          onClick={() => handlePreviewList(idx)}
                          className="px-2 py-1 bg-blue text-white rounded text-sm hover:bg-lightBlue hover:text-black hover:scale-105 transition"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => handleEditList(idx)}
                          className="px-2 py-1 bg-lightYellow text-black rounded text-sm hover:bg-yellow hover:text-blue hover:scale-105 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteList(idx)}
                          className="px-2 py-1 bg-red text-white rounded text-sm hover:text-black hover:scale-105 transition"
                        >
                          Delete
                        </button>
                      </Disclosure.Panel>
                        </div>
                          
                       
                      )}
                    </Disclosure>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Preview / New CSV Panel */}
          <AnimatePresence>
            {previewData.length > 0 && mode && (
              <motion.div
                className="bg-white flex flex-col rounded-lg p-2 md:w-2/3 w-full max-h-[80vh] min-h-[80vh]  shadow-lg"
                initial="hidden"
                animate="visible"
                variants={previewPanelVariants}
                exit="exit"
              >
                {/* Panel Header */}
                <div className="flex-none px-6 border-b bg-white">
                  {mode === "edit" ? (
                    <input
                      value={listName}
                      onChange={(e) => setListName(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none mb-2"
                    />
                  ) : (
                    <h3 className="text-2xl sm:text-xl font-semibold">
                      Preview: {selectedFile?.name}
                    </h3>
                  )}
                </div>

                {(mode === "new" || mode === "edit" || mode === "preview") && (
                  <Disclosure as="div" className="rounded-lg bg-darkGrey divide-y divide-black mx-2 my-4 border-2 border-cyan shadow-cyanShadow">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="group flex w-full items-center justify-between px-4 py-2 ">
                          <span className="text-lg font-semibold text-white">Duplicate &amp; Blocked Emails</span>
                          <ChevronDownIcon
                            className={`w-8 h-8 text-white transition-transform duration-200 ${
                              open ? "rotate-180" : ""
                            }`}
                          />
                        </Disclosure.Button>
                        { (duplicateEmails?.length > 0 || blockedEmails?.length > 0)? (
                           <Disclosure.Panel className="px-2 pt-2 pb-4 space-y-4 max-h-60 overflow-auto">
                          {duplicateEmails.length > 0 && (
                            <Disclosure.Panel>
                              <h4 className="font-bold py-1 text-black px-4 rounded-lg bg-white">
                                Duplicate Emails [{duplicateEmails.length}]
                              </h4>
                              <ul className="list-disc pt-2  px-4 list-inside text-md text-orange">
                                {duplicateEmails.map((email, idx) => (
                                  <li key={`dup-${idx}`}>{email}</li>
                                ))}
                              </ul>
                            </Disclosure.Panel>
                          )}

                          {blockedEmails.length > 0 && (
                            <div>
                              <h4 className="font-bold py-1 text-black px-4 rounded-lg bg-white">
                                Blocked Emails [{blockedEmails.length}]
                              </h4>
                              <ul className="list-disc pt-2 px-4 list-inside text-md text-orange">
                                {blockedEmails.map((email, idx) => (
                                  <li key={`blk-${idx}`}>{email}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </Disclosure.Panel>
                         ) : (
                           <Disclosure.Panel className="px-2 pt-2 pb-4 space-y-4 max-h-60 overflow-auto">
                             <h4 className="font-bold py-1 text-black px-4 rounded-lg bg-white">
                               No duplicate or blocked emails found
                             </h4>
                           </Disclosure.Panel>
                         )}
                        
                      </>
                    )}
                  </Disclosure>
                )}
                {/* Table */}
                <div className="flex-1 overflow-auto  px-6 "
                 style={{ scrollbarWidth: "thin", scrollbarColor: "blue lightGrey" }}
                >
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="sticky top-0 z-2 border px-2 py-1 bg-lightGrey text-left">
                          S. No
                        </th>
                        {headers.map((h, i) => (
                          <th
                            key={i}
                            className="sticky top-0 z-2 border px-2 py-1 bg-lightGrey text-left"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, rIdx) => (
                        <tr key={rIdx} className="">
                          <td className="border px-2 py-1">{rIdx + 1}</td>
                          {headers.map((h, cIdx) => (
                            <td
                              key={cIdx}
                              className="border px-2 py-1 cursor-pointer hover:bg-ultraLightGreen"
                              onClick={() => handleCellClick(rIdx, h)}
                            >
                              {row[h]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Panel Footer */}
                <div className="flex-none border-t items-center  p-2 border-lightOrange flex justify-end space-x-4 rounded-lg bg-darkGrey divide-y divide-orange m-2">
                  {mode === "new" && (
                    <>
                      {" "}
                      <motion.button
                        onClick={handleCreateClick}
                        className="px-4 py-1 mt-2 bg-lightGreen text-white rounded hover:bg-green hover:shadow-lightOrange "
                      >
                        Create List
                      </motion.button>
                      <motion.button
                        onClick={handleClearCSV}
                        className="px-4 py-1 mt-2 bg-grey text-white rounded hover:bg-lightBrown hover:text-black"
                      >
                        Clear CSV
                      </motion.button>
                    </>
                  )}
                  {mode === "preview" && (
                    <motion.button
                      onClick={handleCancel}
                      className="px-4 py-1 bg-red text-white mt-2 rounded hover:bg-lightRed hover:text-black"
                    >
                      close
                    </motion.button>
                  )}
                  {mode === "edit" && (
                    <>
                      {" "}
                      <motion.button
                        onClick={handleSaveChanges}
                        className="px-2 py-1 mt-2 bg-lightGreen text-white rounded  hover:bg-green hover:shadow-lightOrange "
                      >
                        Save Changes
                      </motion.button>
                      <motion.button
                        onClick={handleCancel}
                        className="px-2 py-1 mt-2 bg-grey text-white rounded  hover:bg-lightBrown hover:text-black"
                      >
                        Cancel
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cell Editor Modal */}
          <AnimatePresence>
            {cellEditor.open && (
              <motion.div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                >
                  <h4 className="text-lg font-semibold mb-4">Edit Cell</h4>
                  <input
                    type="text"
                    value={cellEditor.value}
                    onChange={(e) =>
                      setCellEditor((prev) => ({
                        ...prev,
                        value: e.target.value,
                      }))
                    }
                    className="w-full p-2 border rounded mb-4 focus:outline-none"
                  />
                  <div className="flex justify-end">
                    <motion.button
                      onClick={() =>
                        setCellEditor((prev) => ({ ...prev, open: false }))
                      }
                      className="px-2 py-2 bg-grey text-white rounded mr-2"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleCellUpdate}
                      className="px-2 py-2 bg-lightGreen text-white rounded"
                    >
                      Add
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Processing Modal */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                  <p className="mb-2 font-medium">{processingStep}</p>
                  <div className="w-full bg-lightGrey h-3 rounded-full overflow-hidden mb-2">
                    <motion.div
                      className="h-full bg-blue"
                      style={{ width: `${progress}%` }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="font-semibold">{progress}%</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name Dialog */}
          <AnimatePresence initial={false}>
              {showNamePrompt && (
                <div
                  key="name-dialog"
                  className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                  >
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h2 className="text-xl font-semibold mb-4">Name Your List</h2>
                  <input
                    type="text"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    placeholder="Enter list name"
                    className="w-full p-2 border rounded mb-4 focus:outline-none"
                  />
                  <div className="flex justify-end space-x-3">
                    <motion.button
                      onClick={() => setShowNamePrompt(false)}
                      className="px-4 py-2 bg-grey text-white rounded"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleSaveList}
                      className="px-4 py-2 bg-lightGreen text-white rounded"
                    >
                      Save
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default List;
