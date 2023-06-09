import Link, { LinkProps } from "next/link";

// Make a Link component
const PrimaryLinkButton = (
  props: LinkProps & { children: React.ReactNode }
) => {
  return (
    <Link
      className="self-start rounded-md bg-orange-900 px-6 py-4 text-base uppercase hover:bg-orange-800"
      {...props}
    >
      {props.children}
    </Link>
  );
};

export default PrimaryLinkButton;
