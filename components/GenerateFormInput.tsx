import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const GenerateFormInput = () => {
  return (
    <div className="flex items-center gap-4 my-8">
      <Input type="text" placeholder="write your prompt" />
      <Button>Generate</Button>
    </div>
  );
};

export default GenerateFormInput;
