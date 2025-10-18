import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ScheduleMeeting.css";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import PrimaryButton from "../../components/common/PrimaryButton/PrimaryButton";

const ScheduleMeeting = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [timezone, setTimezone] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);

  const { cartItems = [] } = location.state || {};

  useEffect(() => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(userTimezone);
  }, []);

  useEffect(() => {
    generateTimeSlots();
  }, []);

  const generateTimeSlots = () => {
    const slots = [];
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const now = new Date();

    for (let i = 0; i < 24 * 4; i++) {
      const slot = new Date(startOfDay);
      slot.setMinutes(i * 15);

      // Only add slots that are not in the past for the current date
      if (selectedDate.toDateString() === now.toDateString()) {
        if (slot > now) {
          slots.push(slot);
        }
      } else {
        slots.push(slot);
      }
    }

    setTimeSlots(slots);
  };

  const handleScheduleMeeting = () => {
    if (selectedDate && selectedTime) {
      navigate("/schedule-meeting", {
        state: {
          date: selectedDate,
          time: selectedTime,
          timeZone: timezone,
          cartItems: cartItems,
        },
      });
    } else {
      alert("Please select both a date and a time slot to proceed.");
    }
  };

  // Format the time slots for react-select
  const timeSlotOptions = timeSlots.map((slot) => {
    const timeString = slot.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return { value: timeString, label: timeString };
  });

  return (
    <div className="schedule-meeting-main-wrapper">
      <div className="schedule-meeting-main">
        {/* Calendar Section */}
        <div className="schedule-meeting-calender-wrapper">
          <h2 className="mb-3">Schedule a Meeting</h2>
          <p className="text-muted">
            Choose a convenient time to connect with us.
          </p>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate} // Default to current date
            minDate={new Date()} // Restricts to today and future dates
            className="w-100"
          />
        </div>
        {/* Time Slot Section */}
        <div className="schedule-meeting-meeting-time-wrapper">
          <h3 className="mb-3">Meeting Time</h3>
          <div className="mb-3">
            {" "}
            <button className=" btn btn-block btn-light text-muted  w-100">
              15 Mins
            </button>
          </div>
          <p>
            <strong>Select a Time:</strong> <br />
            Showing Time for{" "}
            <span className="text-primary">
              {selectedDate.toDateString()}
            </span>{" "}
            And Time Zone <span className="text-primary">{timezone}</span>
          </p>

          {/* React-Select Dropdown */}
          <div className="mb-3">
            <Select
              options={timeSlotOptions}
              value={timeSlotOptions.find(
                (option) => option.value === selectedTime
              )}
              onChange={(selectedOption) =>
                setSelectedTime(selectedOption.value)
              }
              isSearchable={false}
              placeholder="Select a Meeting Time"
              getOptionLabel={(e) => (
                <div className="time-slot-button">{e.label}</div>
              )}
              styles={{
                menuList: (base) => ({
                  ...base,
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "10px",
                }),
                option: (base) => ({
                  ...base,
                  padding: "0",
                  backgroundColor: "transparent",
                }),
                control: (base) => ({
                  ...base,
                  border: "1px solid #ccc",
                }),
              }}
            />
          </div>
          <div className="w-100 mt-4">
            <PrimaryButton
              title="Schedule Meeting"
              btnClickHandler={handleScheduleMeeting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeeting;
