import Link, { LinkProps } from "next/link";

// Make a Link component
const PrimaryLink = (props: LinkProps & { children: React.ReactNode }) => {
  return (
    <Link className="hover:text-cyan-500" {...props}>
      {props.children}
    </Link>
  );
};

export default PrimaryLink;
