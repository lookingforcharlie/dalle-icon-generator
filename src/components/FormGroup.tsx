import React from "react";

export const FormGroup = (props: React.ComponentPropsWithoutRef<"div">) => {
  //  {...props} is for in case some one wants pass some props
  return (
    <div {...props} className="flex flex-col gap-1">
      {props.children}
    </div>
  );
};
