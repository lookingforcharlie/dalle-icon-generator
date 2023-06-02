// Add <Header /> into <SessionProvider /> in _app.tsx, if you want Header component show up in each page

import { signIn, signOut, useSession } from "next-auth/react";
import { StaticImageData } from "next/image";
import Link from "next/link";
import { FC } from "react";
import rabbit_no_bg from "../../public/media/rabbit_bot_no_bg.png";
import { useBuyCredits } from "../hooks/useBuyCredits";
import { Button } from "./Button";
import PrimaryLink from "./PrimaryLink";

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  // useSession() is from next-auth
  const session = useSession();
  // console.log(session.data);
  // The double negation (!!value) is a shorthand way to coerce a value to a boolean.
  // It returns true if the value is truthy and false if the value is falsy.
  // You can't miss .data here
  const isLoggedIn = !!session.data;

  const { buyCredits } = useBuyCredits();

  return (
    <header className="container mx-auto my-3  flex h-16 max-w-6xl items-center justify-between px-2 sm:px-6">
      <div className="flex gap-6 self-center">
        <PrimaryLink href="/">
          <img
            src={rabbit_no_bg.src}
            alt="Rabbit Logo"
            className="align-self flex h-16 self-center"
          />
        </PrimaryLink>
        <ul className="flex self-center">
          <li>
            <PrimaryLink href="/generate">Generate Icons</PrimaryLink>
          </li>
        </ul>
      </div>
      <div>
        {isLoggedIn ? (
          <div className="flex gap-4">
            <Button variant="secondary" onClick={buyCredits}>
              Buy Credits
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                signOut().catch(console.error); // doing this for ESLint, same as {signOut}
              }}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={() => {
                signIn().catch(console.error);
              }}
            >
              Login
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
