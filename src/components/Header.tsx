// Add <Header /> into <SessionProvider /> in _app.tsx, if you want Header component show up in each page

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import rabbit_no_bg from "../../public/media/rabbit_bot_no_bg.png";
import { useBuyCredits } from "../hooks/useBuyCredits";
import { api } from "../utils/api";
import { Button } from "./Button";
import PrimaryLink from "./PrimaryLink";

const Header = () => {
  // useSession() is from next-auth
  const session = useSession();
  // console.log(session.data);
  // The double negation (!!value) is a shorthand way to coerce a value to a boolean.
  // It returns true if the value is truthy and false if the value is falsy.
  // You can't miss .data here
  const isLoggedIn = !!session.data;

  const { buyCredits } = useBuyCredits();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log((error as Error).message);
    }
  };
  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const credits = api.user.getUserCredits.useQuery().data;

  return (
    <header className="container mx-auto my-3  flex h-16 max-w-6xl items-center justify-between px-2 sm:px-6">
      <div className="flex gap-6 self-center">
        <PrimaryLink href="/">
          <Image
            src="/media/rabbit_bot_no_bg.png"
            alt="Site logo"
            width={80}
            height={80}
            className="align-self flex self-center"
          />
        </PrimaryLink>
        <ul className="flex gap-4 self-center">
          <li>
            <PrimaryLink href="/generate">Generate Icons</PrimaryLink>
          </li>
          <li>
            <PrimaryLink href="/community">Community</PrimaryLink>
          </li>
          {isLoggedIn && (
            <li>
              <PrimaryLink href="/collection">Collection</PrimaryLink>
            </li>
          )}
        </ul>
      </div>
      <div>
        {isLoggedIn ? (
          <div className="flex gap-4">
            <div className="self-center rounded-md border border-pink-600 px-4 py-2 text-pink-600">
              {`${credits} credits left`}
            </div>
            <Button variant="secondary" onClick={buyCredits}>
              Buy Credits
            </Button>
            <Button variant="primary" onClick={handleSignOut}>
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Button variant="secondary" onClick={handleSignIn}>
              Login
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
