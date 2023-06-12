// Add <HeaderOne /> into <SessionProvider /> in _app.tsx, if you want HeaderOne component show up in each page

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useBuyCredits } from "../hooks/useBuyCredits";
import { api } from "../utils/api";
import { Button } from "./Button";
import PrimaryLink from "./PrimaryLink";

const HeaderOne = () => {
  // useSession() is from next-auth
  const session = useSession();
  // console.log(session.data);
  // The double negation (!!value) is a shorthand way to coerce a value to a boolean.
  // It returns true if the value is truthy and false if the value is falsy.
  // You can't miss .data here
  const isLoggedIn = !!session.data;
  // session.data?.user.image;

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

  // const credits = api.user.getUserCredits.useQuery().data;

  const credits = api.user.getUserCredits.useQuery(undefined, {
    enabled: isLoggedIn,
  });

  return (
    <header className="container mx-auto my-3 flex h-24 max-w-6xl items-center justify-between px-2 shadow-md">
      <div className="flex gap-6 self-center">
        <PrimaryLink href="/">
          <Image
            src="/media/rabbit_bot_no_bg.png"
            alt="Site logo"
            width={70}
            height={70}
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
            {credits.data !== undefined && (
              <div className="self-center rounded-md border border-pink-600 px-4 py-2 text-pink-600">
                {`${credits.data} credits left`}
              </div>
            )}
            <Button variant="secondary" onClick={buyCredits}>
              Buy Credits
            </Button>
            <Button variant="primary" onClick={handleSignOut}>
              Logout
            </Button>
            <Image
              src={session.data?.user.image ?? "/favicon.ico"}
              alt="generated image from your prompt"
              width="40"
              height="20"
              className=""
            />
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

export default HeaderOne;
