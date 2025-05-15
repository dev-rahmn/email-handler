import React, { useState, useEffect, useRef, Fragment } from "react";
import { Listbox, Dialog, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { FcRightUp } from "react-icons/fc";
import Swal from "sweetalert2";

// Static template definitions
const TemplateList = [
  {
    id: 1,
    title: "Welcome Email",
    subject: "Welcome to Our Service!",
    body: `Hi {{firstName}},\n\nThank you for joining our platform. We're excited to have you on board!\n\nBest regards,\nThe Team`,
  },
  {
    id: 2,
    title: "Follow-Up Email",
    subject: "Just Checking In",
    body: `Hi {{firstName}},\n\nI wanted to follow up on our recent conversation and see if you have any questions.\n\nCheers,\nThe Team`,
  },
  {
    id: 3,
    title: "Password Reset",
    subject: "Reset Your Password",
    body: `Hi {{firstName}},\n\nClick the link below to reset your password:\n{{resetLink}}\n\nIf you didn't request this, please ignore this email.\n\nThanks,\nSupport Team`,
  },
  {
    id: 4,
    title: "Software Engineer Hiring",
    subject: "Exciting Opportunity: Software Engineer at {{companyName}}",
    body: `Hi {{firstName}},\n\nI hope you're doing well. My name is {{hrName}}, and I'm a recruiter at {{companyName}}.\n\nWe came across your profile and were impressed by your experience with {{skillSet}} and your work on {{projectName}}.\n\nWe're currently hiring for a Software Engineer role on our team and would love to discuss how your background could be a great fit.\n\nIf you're interested, could we schedule a quick call this week? Let me know your availability.\n\nLooking forward to your response.\n\nBest regards,\n{{hrName}}\nRecruiter, {{companyName}}\nEmail: {{hrEmail}}\nPhone: {{hrPhone}}`,
  },
];

const MailHandler = () => {
  // CSV file state
  const [selectedFile, setSelectedFile] = useState(null);
  const [lists, setLists] = useState([]);

  // Header mapping state
  const [headers, setHeaders] = useState([]);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);

  // Template state
  const [templates, setTemplates] = useState(TemplateList);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({ title: "", subject: "", body: "" });

  // Sending progress state
  const [isSending, setIsSending] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Splitter state
  const [asideWidth, setAsideWidth] = useState(300);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const containerRef = useRef(null);
  const isResizing = useRef(false);

  // Load saved CSV lists
  useEffect(() => {
    const stored = localStorage.getItem("mySavedLists");
    stored && setLists(JSON.parse(stored));
  }, []);

  // Update headers when file changes
  useEffect(() => {
    if (selectedFile && selectedFile.data?.length) {
      const cols = Object.keys(selectedFile.data[0]).filter(
        (h) => h.trim().toLowerCase() !== "id"
      );
      setHeaders(cols);
    }
  }, [selectedFile]);

  // Handle file selection
  const handleFileSelect = (file) => {
    if (file === selectedFile) return;
    setSelectedFile(file);
    setFirstName(null);
    setLastName(null);
    setEmail(null);
    setSelectedTemplate(null);
    setTemplates(TemplateList);
  };

  // Begin editing the selected template
  const startEditing = () => {
    if (!selectedTemplate) return;
    setEditValues({
      title: selectedTemplate.title,
      subject: selectedTemplate.subject,
      body: selectedTemplate.body,
    });
    setIsEditing(true);
  };

  // Save edits back to state
  const saveEdits = () => {
    if (!selectedTemplate) return;
    const updated = { ...selectedTemplate, ...editValues };
    setTemplates((t) => t.map((tpl) => (tpl.id === updated.id ? updated : tpl)));
    setSelectedTemplate(updated);
    setIsEditing(false);
  };

  // Cancel edit
  const cancelEdit = () => setIsEditing(false);

  // Simple email validation
  const validateEmailSelection = () => {
    if (!email) {
      Swal.fire({ icon: "error", title: "Oops…", text: "Please select the Email field." });
      return false;
    }
    const regex = /^\S+@\S+\.\S+$/;
    const bad = selectedFile.data.find((row) => !regex.test((row[email] || "").trim()));
    if (bad) {
      Swal.fire({ icon: "error", title: "Invalid Email Mapping", text: "Selected column has invalid emails." });
      return false;
    }
    return true;
  };

  // Handle sending emails
  const handleSendEmail = async () => {
    if (!firstName || !email) {
      Swal.fire({ icon: "warning", title: "Incomplete Mapping", text: "Map First Name & Email before sending." });
      return;
    }
    if (!validateEmailSelection()) return;

    const rows = selectedFile.data;
    const total = rows.length;
    setIsSending(true);
    setCurrentIndex(0);

    const fillTemplate = (tmpl, map) => tmpl.replace(/{{(.*?)}}/g, (_, key) => map[key] || "");
    for (let i = 0; i < total; i++) {
      const row = rows[i];
      const map = {
        firstName: row[firstName] || "",
        lastName: lastName ? row[lastName] || "" : "",
        email: row[email] || "",
      };
      const subject = fillTemplate(selectedTemplate.subject, map);
      const body = fillTemplate(selectedTemplate.body, map);
      console.group(`Email ${i + 1}/${total}`);
      console.log(subject);
      console.log(body);
      console.groupEnd();
      setCurrentIndex(i + 1);
      await new Promise((r) => setTimeout(r, 100));
    }
    setIsSending(false);
    Swal.fire({ icon: "success", title: "All Done!", text: `${rows.length} emails sent.` });
  };

  const total = selectedFile?.data?.length || 0;
  const percent = total ? Math.round((currentIndex / total) * 100) : 0;
  const isMobile = windowWidth < 768;
  const asideStyle = isMobile ? { width: '100%' } : { width: asideWidth };

  // Track resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isResizing.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let newW = e.clientX - rect.left;
      newW = Math.max(150, Math.min(rect.width - 150, newW));
      setAsideWidth(newW);
    };
    const onMouseUp = () => (isResizing.current = false);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div className="px-4 pt-16 pb-4 min-h-screen bg-white">
      <h1 className="font-bold text-2xl text-black mb-4">Mail Handler</h1>
      <div ref={containerRef} className="flex flex-col md:flex-row gap-4">
        {/* Left pane: CSV lists */}
        <aside className="bg-darkGrey rounded-lg p-4 overflow-auto transition-width" style={asideStyle}>
          <h2 className="text-lg font-semibold text-white mb-2">CSV Files</h2>
          <ul>
            {lists.map((file, idx) => (
              <li
                key={idx}
                onClick={() => handleFileSelect(file)}
                className={`cursor-pointer p-2 mb-1 rounded-md border shadow-inner transition-colors ${
                  selectedFile === file
                    ? "bg-lightCyan text-black"
                    : "bg-darkBrown text-white hover:bg-lightGrey"
                }`}>
                {file.name}
              </li>
            ))}
          </ul>
        </aside>
        {/* Resizer */}
        <div
          onMouseDown={() => (isResizing.current = true)}
          className="w-2 cursor-ew-resize bg-red hover:bg-darkGrey rounded-full my-auto"
        />
        {/* Right pane: template mapping & preview */}
        <section className="flex-1 bg-darkGrey rounded-lg p-4 overflow-auto">
          {!selectedFile ? (
            <p className="text-lightGrey">Select a CSV to begin.</p>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-white mb-4">Templates for {selectedFile.name}</h2>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Template selector + field mappings */}
                <div className="w-full md:w-[300px] bg-darkBrown rounded-lg p-4 space-y-4">
                  {/* Template dropdown */}
                  <div>
                    <span className="text-white mb-1 block">Template</span>
                    <Listbox value={selectedTemplate} onChange={setSelectedTemplate}>
                      <div className="relative">
                        <Listbox.Button className="w-full py-2 pl-3 pr-10 text-left bg-darkGrey text-white rounded-md">
                          <span className="block truncate">{selectedTemplate?.title || "Select..."}</span>
                          <ChevronUpDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-lightGrey" />
                        </Listbox.Button>
                        <Listbox.Options className="absolute mt-1 w-full bg-darkGrey rounded-md max-h-60 overflow-auto py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                          {templates.map((tpl) => (
                            <Listbox.Option key={tpl.id} value={tpl} className={({ active }) => 
                              `cursor-pointer select-none relative py-2 pl-10 pr-4 ${active ? 'bg-grey text-white' : 'text-lightGrey'}`
                            }>
                              {({ selected }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-medium text-cyan' : ''}`}>{tpl.title}</span>
                                  {selected && <CheckIcon className="absolute left-0 top-2 ml-3 h-5 w-5 text-cyan" />}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>
                  {/* Field mapping dropdowns */}
                  {['First Name', 'Last Name', 'Email'].map((label) => {
                    const val = label === 'First Name' ? firstName : label === 'Last Name' ? lastName : email;
                    const setter = label === 'First Name' ? setFirstName : label === 'Last Name' ? setLastName : setEmail;
                    return (
                      <div key={label} className="flex flex-col">
                        <span className="text-white mb-1">{label}</span>
                        <Listbox value={val}
                         onChange={setter} 
                          className={`relative z-1 ${!selectedTemplate ? "opacity-50 cursor-not-allowed border rounded-lg border-red" : ""}`}
                        disabled={!selectedTemplate}
                         >
                          <div className="relative">
                            <Listbox.Button className={`w-full py-2 pl-3 pr-10 text-left bg-darkGrey rounded-md ${!selectedTemplate ? 'opacity-50 cursor-not-allowed' : ''} 
                            ${val ? 'bg-grey border border-cyan' : ''} ${val ? 'text-white' : 'text-lightGrey'}`}> 
                              <span className="block truncate">{val || `Select ${label}`}</span>
                              <ChevronUpDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-lightGrey" />
                            </Listbox.Button>
                            <Listbox.Options className="absolute mt-1 w-full bg-darkGrey rounded-md max-h-50 overflow-auto py-1 shadow-lg ring-1 ring-black ringopacity-5 z-50">
                              {headers.map((opt) => (
                                <Listbox.Option key={opt} value={opt} className={({ active }) =>
                                  `cursor-pointer selectnone relative py-2 pl-10 pr-4 ${active ? 'bg-grey text-white' : 'text-lightGrey'}`
                                }>
                                  {({ selected }) => (
                                    <>
                                      <span className={`block truncate ${selected ? 'font-medium text-cyan' : ''}`}>{opt}</span>
                                      {selected && <CheckIcon className="absolute left-0 top-2 ml-3 h-5 w-5 text-cyan" />}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </div>
                        </Listbox>
                      </div>
                    );
                  })}
                </div>

                {/* Preview / Edit pane */}
                <div className="w-full bg-darkBrown rounded-lg p-4 overflow-y-auto lg:h-[70vh] sm:h-[50vh]">
                  {selectedTemplate ? (
                    isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-lightCyan mb-1"> Template Title</label>
                          <h5 className="w-full p-2  rounded text-white shadow-inner shadow-lightOrange">
                           {editValues.title}
                          </h5>
                            
                        </div>
                        <div>
                          <label className="block text-lightCyan mb-1">Subject</label>
                          <input
                            type="text"
                            className="w-full p-2 bg-darkGrey rounded text-white"
                            value={editValues.subject}
                            onChange={(e) => setEditValues(v => ({ ...v, subject: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-lightCyan mb-1">Body</label>
                          <textarea
                            rows={10}
                            className="w-full p-2 bg-darkGrey rounded text-white font-mono whitespace-pre-wrap"
                            value={editValues.body}
                            onChange={(e) => setEditValues(v => ({ ...v, body: e.target.value }))}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={saveEdits} className="px-4 py-2 bg-cyan rounded hover:bg-cyan/90">Save</button>
                          <button onClick={cancelEdit} className="px-4 py-2 bg-red/50 text-white rounded hover:bg-red">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h3 className="text-md font-semibold text-cyan">{selectedTemplate.title}</h3>
                          <button onClick={startEditing} className="px-2 py-1 bg-cyan rounded hover:bg-cyan/90 text-sm">Edit</button>
                        </div>
                        <p className="text-sm text-lightCyan mb-2"><strong>Subject:</strong> {selectedTemplate.subject}</p>
                        <pre className="text-sm text-white whitespace-pre-wrap font-mono">{selectedTemplate.body}</pre>
                      </div>
                    )
                  ) : (
                    <p className="text-lightGrey">No template selected.</p>
                  )}
                </div>
              </div>

              {/* Send button */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSendEmail}
                  disabled={isSending}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan text-white rounded hover:bg-cyan/90 disabled:opacity-50"
                >
                  <FcRightUp className="h-6 w-6" />
                  <span>Send Email</span>
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Progress overlay */}
      <>
      {isSending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              📤 Sending Emails
            </h3>

            {/* Counter + Percent */}
            <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
              <span>
                {currentIndex} / {total}
              </span>
              <span className="font-medium">{percent}%</span>
            </div>

            {/* Animated Striped Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-6">
              <div
                className="h-full bg-darkGreen bg-[length:1rem_1rem] animate-[stripe_1s_linear_infinite]"
                style={{
                  width: `${percent}%`,
                  backgroundImage:
                    "linear-gradient(45deg, rgba(255,255,255,0.3) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.3) 75%, transparent 75%, transparent)",
                }}
              />
            </div>

            {/* Centered Bounce Loader */}
            <div className="flex justify-center space-x-4 my-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-4 h-4 bg-cyan rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>

            {/* Done Button */}
            {currentIndex === total && (
              <button
                onClick={() => setIsSending(false)}
                className="mt-2 px-4 py-1 bg-cyan text-black rounded hover:bg-cyan/90"
              >Done</button>
            )}
          </div>
        </div>
      )}
    </>
    </div>
  );
};

export default MailHandler;
