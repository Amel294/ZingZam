import { RadioGroup, Radio } from "@nextui-org/react";

export default function GenderRadio({ gender, setGender }) {
    return (
        <div className="ps-3">
            <span className="text-xs text-purple-400 ">Select your Gender</span>
            <RadioGroup className="text-xs pt-2"
                orientation="horizontal"
                value={gender}
                onValueChange={setGender}
            >
                <Radio value="male" size="sm">Male</Radio>
                <Radio value="female" size="sm">Female</Radio>
                <Radio value="Other" size="sm">Other</Radio>
            </RadioGroup>
        </div>
    );
}
