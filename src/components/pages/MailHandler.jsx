import React, { useState, useEffect, Fragment } from "react";
import { Listbox, Dialog, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { FcRightUp } from "react-icons/fc";
import Swal from "sweetalert2";

// Define CSV files list
const CSVList = [
  { id: 1, name: "employees.csv" },
  { id: 2, name: "projects.csv" },
  { id: 3, name: "sales.csv" },
];

// Define email templates
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [mapField1, setMapField1] = useState(null);
  const [mapField2, setMapField2] = useState(null);
  const [mapField3, setMapField3] = useState(null);

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);

  const [headers, setHeaders] = useState([]);
  const [lists, setLists] = useState([]);
  
  // new state for modal + progress
  const [isSending, setIsSending] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);


  const validateEmailSelection = () => {
    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Oops…",
        text: "Please select the Email field before sending.",
      });
      return false;
    }
  
    // Simple RFC-like regex for “something@something.something”
    const emailRegex = /^\S+@\S+\.\S+$/;
  
    const badRow = selectedFile.data.find(
      (row) => !emailRegex.test((row[email] || "").trim())
    );
  
    if (badRow) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email Mapping",
        text: `The column you picked contains non-email values.  
          Please select the correct Email option.`,
      });
      return false;
    }
  
    return true;
  };

  // load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("mySavedLists");
    stored && setLists(JSON.parse(stored));
  }, []);

  // rebuild headers on file change
  useEffect(() => {
    if (selectedFile) {
      const cols = Object.keys(selectedFile.data[0] || {})
        .filter((h) => h.trim().toLowerCase() !== "id");
      setHeaders(cols);
    }
  }, [selectedFile]);

  const handleFileSelect = (file) => {
    if (file === selectedFile) return;
    setSelectedFile(file);
    setTemplates(TemplateList);
    setSelectedTemplate(null);
    setFirstName(null);
    setLastName(null);
    setEmail(null);
  };

  // the new async handler
  const handleSendEmail = async () => {
    // 1) Guard: ensure mappings exist
    if (!firstName || !email) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Mapping",
        text: "You must map at least the First Name & Email fields.",
      });
      return;
    }
    if (!validateEmailSelection()) return;
  
    const rows = selectedFile.data;
    const total = rows.length;
  
    // 2) Prepare
    setIsSending(true);
    setCurrentIndex(0);
    const { subject: subjTpl, body: bodyTpl } = selectedTemplate;
  
    // single regex fill function
    const fillTemplate = (tmpl, map) =>
      tmpl.replace(/{{(.*?)}}/g, (_, key) => map[key] || "");
  
    // 3) Loop & send
    for (let i = 0; i < total; i++) {
      const row = rows[i];
      const mapped = {
        firstName: row[firstName] || "",
        lastName: lastName ? row[lastName] || "" : "",
        email: row[email] || "",
      };
  
      // fast one-pass replacement
      const subject = fillTemplate(subjTpl, mapped);
      const body = fillTemplate(bodyTpl, mapped);
  
      console.group(`Email ${i + 1}/${total} → ${mapped.email}`);
      console.log("Subject:", subject);
      console.log("Body:\n", body);
      console.groupEnd();
  
  
      setCurrentIndex(i + 1);
      await new Promise((res) => setTimeout(res, 100));
    }
  
    setIsSending(false);
    Swal.fire({
      icon: "success",
      title: "All Done!",
      text: `✅ ${total} emails processed successfully.`,
    });
  };

  const total = selectedFile?.data?.length || 0;
  const percent = total > 0 ? Math.round((currentIndex / total) * 100) : 0;

  return (
    <div className="px-4 pt-16 pb-4 min-h-screen bg-white">
      <h1 className="font-bold text-2xl text-black mb-2">Mail Handler</h1>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left pane: CSV files */}
        <aside className="w-full md:w-1/4 bg-darkGrey rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white mb-2">CSV Files</h2>
          <ul>
            {lists?.map((file, index) => (
              <li
                key={index}
                onClick={() => handleFileSelect(file)}
                className={`cursor-pointer p-2 rounded-md mb-1 border bg-darkBrown border-lightBrown shadow-inner shadow-lightOrange hover:shadow-cyanShadow hover:text-black
                   hover:border-darkCyan transition-colors hover:bg-ultraLightGreen ${
                  selectedFile === file
                    ? "bg-lightCyan text-black hover:bg-darkCyan hover:text-blue"
                    : "text-white hover:bg-lightGrey"
                }`}
              >
                <span>{file.name}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Right pane: Templates split view */}
        <section className="w-full bg-darkGrey rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white mb-4">
            Templates {selectedFile && `for ${selectedFile.name}`}
          </h2>
          {!selectedFile ? (
            <p className="text-lightGrey">
              Select a CSV file to load templates.
            </p>
          ) : (
            <div className="flex flex-col md:flex-row gap-4">
              {/* Fixed list of templates */}
              <div className="w-full md:w-[300px] bg-darkBrown rounded-lg p-2">
                {/* Template select */}
                <span className="text-white mb-1">Template</span>
                <Listbox
                  as="div"
                  value={selectedTemplate}
                  onChange={setSelectedTemplate}
                  className="relative"
                >
                  <Listbox.Button className="w-full py-2 pl-3 pr-10 text-left text-white bg-darkGrey rounded-md focus:outline-none focus:ring-2 focus:ring-cyan">
                    <span className="block truncate">
                      {selectedTemplate?.title || "Select a template"}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-lightGrey"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full z-50 overflow-auto bg-darkGrey rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5">
                    {templates.map((tpl) => (
                      <Listbox.Option
                        key={tpl.id}
                        value={tpl}
                        className={({ active }) =>
                          `cursor-pointer border rounded-lg  select-none relative py-2 pl-10 pr-4 ${
                            active ? "bg-grey text-white" : "text-lightGrey"
                          }`
                        }
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium text-cyan " : ""
                              }`}
                            >
                              {tpl.title}
                            </span>
                            {selected && (
                              <CheckIcon className="absolute left-0 top-2 h-5 w-5 text-cyan ml-3" />
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>

                {/* Mapping dropdowns */}
                <div className="grid grid-cols-1 mt-4  gap-4">
                  {[
                    {
                      label: "First Name",
                      value: firstName,
                      onChange: setFirstName,
                      options: headers,
                    },
                    {
                      label: "Last Name",
                      value: lastName,
                      onChange: setLastName,
                      options: headers,
                    },
                    {
                      label: "Email",
                      value: email,
                      onChange: setEmail,
                      options: headers,
                    },
                  ].map(({ label, value, onChange, options }) => (
                    <div key={label} className="flex flex-col">
                      <span className="text-white mb-1">{label}</span>
                      <Listbox
                        as="div"
                        value={value}
                        onChange={onChange}
                        className={`relative z-1 ${!selectedTemplate ? "opacity-50 cursor-not-allowed border rounded-lg border-red" : ""}`}
                        disabled={!selectedTemplate}
                      >
                        <Listbox.Button className={`w-full py-2 pl-3 pr-10 text-left text-white bg-darkGrey rounded-md focus:outline-none focus:ring-2 focus:ring-cyan
                           ${value !== null  ? "border border-cyan" : "text-lightGrey"} ${!selectedTemplate ? "opacity-50 cursor-not-allowed" : ""}`}
                           >
                          <span className="block truncate">
                            {value || `Select ${label}`}
                          </span>
                          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-lightGrey"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>
                        <Listbox.Options className="absolute mt-1 z-50 max-h-50 w-full overflow-auto bg-darkGrey rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5">
                          {options.map((opt) => (
                            <Listbox.Option
                              key={opt}
                              value={opt}
                              className={({ active }) =>
                                `cursor-pointer select-none relative py-2 pl-10 pr-4  ${
                                  active
                                    ? "bg-grey text-white"
                                    : "text-lightGrey"
                                }`
                              }
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? "font-medium text-cyan" : ""
                                    }`}
                                  >
                                    {opt}
                                  </span>
                                  {selected && (
                                    <CheckIcon className="absolute left-0 top-2 h-5 w-5 text-cyan ml-3" />
                                  )}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Listbox>
                    </div>
                  ))}
                </div>
              </div>
              {/* Right side: fixed-width controls and preview (400px) */}
              <div className="w-full md:w-full bg-darkBrown rounded-lg p-4 overflow-y-scroll lg:h-[70vh] sm:h-[50vh]">
                {/* Preview selected template */}
                {selectedTemplate && (
                  <div className="bg-darkBrown rounded-lg p-4">
                    <h3 className="text-md font-semibold text-cyan mb-2">
                      {selectedTemplate.title}
                    </h3>
                    <p className="text-sm text-lightCyan mb-4">
                      <strong>Subject:</strong> {selectedTemplate.subject}
                    </p>
                    <pre className="text-sm text-white whitespace-pre-wrap">
                      {selectedTemplate.body}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
      {selectedTemplate && (
        <div className="bg-darkGrey p-4 mt-4 rounded-lg flex justify-end">
          <button
            className="flex flex-row gap-2 items-center text-md hover:bg-cyan hover:scale-105 transition border border-black 
            shadow-inner shadow-lightOrange 
            px-4 py-2 bg-cyan text-white rounded-md hover:bg-cyan-600"
             onClick={handleSendEmail}
          >
            <FcRightUp className="w-6 h-6" />
            <p className="text-bold text-lg text-darkBrown"> Send Email</p>
          </button>
        </div>
      )}

       {/* Progress overlay */}
       {isSending && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-sm">
            <h3 className="text-xl font-semibold mb-4">Sending Emails</h3>
            <div className="flex justify-between text-sm mb-1">
              <span>
                {currentIndex} / {total}
              </span>
              <span>{percent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className="h-4 rounded-full transition-all duration-200"
                style={{ width: `${percent}%`, backgroundColor: "#06b6d4" }}
              />
            </div>
            {currentIndex === total && (
              <button
                onClick={() => setIsSending(false)}
                className="mt-2 flex flex-row gap-2 items-center text-md  hover:scale-105  border border-black px-4 py-1 bg-cyan text-black rounded md hover:bg-darkBrown hover:text-white transition-all duration-200"
              >
                Done
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default MailHandler;
