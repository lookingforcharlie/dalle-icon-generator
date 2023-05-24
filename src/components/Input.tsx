function Input(props: React.ComponentPropsWithoutRef<"input">) {
  return (
    <input
      {...props}
      type="text"
      className="rounded-md border-2 border-orange-600 px-4 py-2 text-gray-700 focus:outline-none"
    ></input>
  );
}

export default Input;
