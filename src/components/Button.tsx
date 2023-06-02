import React from "react";

export const Button = (
  props: React.ComponentPropsWithoutRef<"button"> & {
    variant: "primary" | "secondary";
  }
) => {
  const color =
    props.variant === "primary"
      ? "bg-stone-800 hover:bg-stone-700"
      : "bg-orange-900 hover:bg-orange-800";

  //  {...props} is for in case some one wants pass some props
  return (
    <button
      {...props}
      className={`rounded-md bg-orange-900 px-4 py-2 text-base uppercase ${color}`}
    >
      {props.children}
    </button>
  );
};
