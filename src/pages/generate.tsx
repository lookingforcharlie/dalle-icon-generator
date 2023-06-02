import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../components/Button";
import { FormGroup } from "../components/FormGroup";
import Input from "../components/Input";
import { generateRouter } from "../server/api/routers/generate";
import { api } from "../utils/api";

import { b64Image } from "../data/image";

const GeneratePage: NextPage = () => {
  const [form, setForm] = useState({
    prompt: "",
  });

  const [imgUrl, setImgUrl] = useState<string>("");

  // we just create generate.ts file
  // Now we have this object: generateIcon that has methods on it that we can call to generate the icon in the backend
  // We are having the type safe in both front and back end.
  const generateIcon = api.generate.generateIcon.useMutation({
    onSuccess(data) {
      console.log("mutation finished", data);
      if (!data?.imageUrl) return;
      setImgUrl(data.imageUrl);
    },
  });

  // creating a function that return a function
  // We can abstract this function away, make it a utility function
  function updateForm(key: string) {
    return function (e: React.ChangeEvent<HTMLInputElement>) {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };
  }

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(
      "submitting the form data to the backend, this is where tRPC starts to come to the play."
    );
    generateIcon.mutate({
      prompt: form.prompt,
    });

    // dumb version
    // setForm((prev) => ({
    //   ...prev,
    //   prompt: "",
    // }));

    // smart version
    setForm({ prompt: "" });
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-start">
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <FormGroup>
            <label>Prompt</label>
            <Input value={form.prompt} onChange={updateForm("prompt")}></Input>
          </FormGroup>

          <Button variant="secondary">Generate Icons</Button>
        </form>

        {/* Use Next Image component, we need to give the permission to hit the url */}
        <Image
          src={imgUrl}
          alt="generated image from your prompt"
          width="100"
          height="100"
        />
        {/* <img
          // src={`data:image/png;base64, ${imgUrl}`} // with the prefix of 'data:image/png;base64', img tag can show pics using base64 format
          src={imgUrl}
          alt="generated image from your prompt"
          width={100}
          height={100}
        /> */}
      </main>
    </>
  );
};

export default GeneratePage;
