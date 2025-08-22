import { Button } from "@/components/ui/button";
import React from "react";

const PageNotFound = () => {
  return (
    <div className="bg-black flex min-h-screen flex-col items-center justify-center gap-4 ">
      <h1 className="text-3xl hover:text-primary text-white">
        {" "}
        Page Not Found
      </h1>
    </div>
  );
};

export default PageNotFound;
