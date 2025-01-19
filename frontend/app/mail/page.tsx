"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import Select, { MultiValue, ActionMeta } from 'react-select';

type SelectOption = {
  value: string;
  label: string;
};

type ValueType = SelectOption | SelectOption[];

export default function Mail() {
  const [allUser, setAlluser] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [filterUser, setfilteruser] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [options, setOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/all`,{
        headers : {
            token : localStorage.getItem("Token")
        }
      });
      if (response.data) {
        let users: string[] = [];
        let opt: SelectOption[] = [];
        for (let i = 0; i < response.data.users.length; i++) {
          const email = response.data.users[i].Email;
          users.push(email);
          opt.push({ value: email, label: email });
        }
        setOptions(opt);
        setAlluser(users);
      }
    };
    fetchData();
  }, []);

  const SendMail = async () => {
    const token = localStorage.getItem("Token");
    if (token) {
      const recipients = selectAll ? allUser : selectedOptions;
      console.log(recipients);
      if (recipients.length === 0 || msg === "") {
        alert("Please select recipients and enter a message");
        return;
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/email`,{
          message: msg,
          recivers: recipients
        },{
            headers: {
              token: localStorage.getItem("Token")
            },
        }
      );
      if (response.data.msg === "Mail Sent") {
        alert("Mail Sent");
      } else {
        alert("Server Down");
      }
    }
  };

  const handleChange = (selected: MultiValue<SelectOption>, actionMeta: ActionMeta<SelectOption>) => {
    const values = selected.map((item: SelectOption) => item.value);  // Explicitly map over MultiValue
    setSelectedOptions(values);  // Update the state with the selected values
  };

  return (
    <div className="text-black h-screen">
      <div className="text-center text-2xl font-bold font-serif mb-20">Send Email</div>
      <div className="flex justify-center">
        <div className="flex flex-col justify-center space-y-4">
          <textarea
            onChange={(e) => setMsg(e.target.value)}
            className="border border-black rounded-lg p-4 w-[500px] max-sm:w-[360px] h-[300px]"
          />

          <Select
            isMulti
            options={options}
            onChange={handleChange}
            value={options.filter(option => selectedOptions.includes(option.value))}
            // Enable search functionality
            filterOption={(option, searchText) =>
              option.label.toLowerCase().includes(searchText.toLowerCase())
            }
            className="border border-black"
          />

          <div className="flex items-center space-x-2">
            <label>Select All</label>
            <input
              onChange={(e) => setSelectAll(e.target.checked)}
              type="checkbox"
            />
          </div>
          <button
            className="mt-4 text-center px-4 py-3 border border-black rounded-lg w-[100px] bg-blue-500 text-white hover:bg-blue-600"
            onClick={SendMail}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
