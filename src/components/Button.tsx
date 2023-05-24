import React from "react";

export const Button = (props: React.ComponentPropsWithoutRef<"button">) => {
  //  {...props} is for in case some one wants pass some props
  return (
    <button
      {...props}
      className="rounded-md bg-orange-900 px-4 py-2 font-semibold uppercase hover:bg-orange-800"
    >
      {props.children}
    </button>
  );
};
