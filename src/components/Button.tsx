import React from "react";
import Spinner from "./Spinner";

export const Button = (
  props: React.ComponentPropsWithoutRef<"button"> & {
    variant: "primary" | "secondary";
    isLoading?: boolean;
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
      className={`flex items-center justify-center rounded-md bg-orange-900 px-4 py-2 text-base uppercase disabled:bg-gray-600 ${color}`}
    >
      {props.isLoading && <Spinner />}
      {!props.isLoading && props.children}
      {/* {props.children} */}
    </button>
  );
};
