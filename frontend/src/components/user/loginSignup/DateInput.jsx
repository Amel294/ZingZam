import React from "react";

function DateInput({ bday, setBday, bdayValid, setBdayValid, bdayTouched }) {
    const handleDateChange = (event) => {
        const selectedDate = event.target.value;
        setBday(selectedDate);

        const birthDate = new Date(selectedDate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age >= 18) {
            setBdayValid(true);
        } else {
            setBdayValid(false);
        }
    };

    return (
        <div className='px-3'>
            <div className="date-input-container">
                <div>
                    <label htmlFor="dateInput" className='text-xs text-purple-400'>Date of Birth</label>
                </div>
                <div className='bg-transparent'>
                    <input
                        type="date"
                        id="dateInput"
                        name="dateInput"
                        value={bday}
                        onChange={handleDateChange}
                        className="bg-transparent text-sm pb-2 flex flex-row items-center"
                    />
                </div>
            </div>
            {bdayTouched && !bdayValid && <p className="error-message text-xs text-red-600">You must be at least 18 years old.</p>}
        </div>
    );
}

export default DateInput;
