import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../components/Button";
import { FormGroup } from "../components/FormGroup";
import Input from "../components/Input";
import { api } from "../utils/api";

// import { b64Image } from "../data/image";

const colors = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "violet",
  "white",
  "black",
];
const shapes = ["square", "circle", "rounded"];
const styles = [
  "metallic",
  "3d",
  "pixelated",
  "gradient",
  "illustrated",
  "minimalistic",
  "hand-drawn",
  "line-art",
  "pop-art",
  "doodle",
  "grunge",
  "mosaic",
];

const GeneratePage: NextPage = () => {
  // we are sending over numberOfIcons as a string instead of number, we need to parse it
  const [form, setForm] = useState({
    prompt: "",
    color: "",
    shape: "",
    style: "",
    numberOfIcons: "1",
  });

  const [imagesUrl, setImagesUrl] = useState<string[]>([]);
  const [err, setErr] = useState<string>("");

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

  // we just create generate.ts file
  // Now we have this object: generateIcon that has methods on it that we can call to generate the icon in the backend
  // We are having the type safe in both front and back end.
  const generateIcon = api.generate.generateIcon.useMutation({
    onSuccess(data) {
      console.log("mutation finished", data);
      if (!data) return;
      data.map((item) => {
        if (!item?.imageUrl) return;
        setImagesUrl((prev) => prev.concat(item.imageUrl));
      });
      // setImagesUrl(data)
    },
    onError(error) {
      if (error.message === "UNAUTHORIZED") {
        setErr("Please sign in to generate icons.");
      }
      setErr(error.message);
    },
  });

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setImagesUrl([]);
    console.log(
      "submitting the form data to the backend, this is where tRPC starts to come to the play."
    );
    // Parsing the numberOfIcons from string to number
    generateIcon.mutate({
      ...form,
      numberOfIcons: parseInt(form.numberOfIcons),
    });

    // generateIcon.mutate({
    //   prompt: form.prompt,
    //   color: form.color,
    // });

    // dumb version
    // setForm((prev) => ({
    //   ...prev,
    //   prompt: "",
    // }));

    // smart version
    // setForm((prev) => ({
    //   ...prev,
    //   prompt: "",
    // }));
  }

  return (
    <>
      <Head>
        <title>Generating DALL-E Icons</title>
        <meta name="description" content="Generate icons by prompts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto mt-20 flex min-h-screen max-w-4xl flex-col justify-start gap-4 px-4">
        <h1 className="text-4xl">Generate your icons</h1>
        <p className="mb-12 text-xl font-thin">
          Fill out the form below to start generating your icons
        </p>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-10">
          {/* Prompt starts here */}
          <FormGroup>
            <h2 className="text-lg">
              1. Describe what you want your icons to look like.
            </h2>
            <label>Prompt</label>
            <Input
              required
              value={form.prompt}
              onChange={updateForm("prompt")}
            ></Input>
          </FormGroup>
          {/* Prompt ends here */}

          {/* Color starts here */}
          <FormGroup>
            <h2 className="text-lg">2. Pick your icon color.</h2>
            <div className="grid grid-cols-4">
              {colors.map((color) => {
                return (
                  <label
                    key={color}
                    className={`flex gap-2 text-xl text-${color}-500`}
                  >
                    <input
                      required
                      type="radio"
                      name="color"
                      checked={color === form.color}
                      onChange={() =>
                        setForm((prev) => ({
                          ...prev,
                          color,
                        }))
                      }
                    ></input>
                    {color}
                  </label>
                );
              })}
            </div>
          </FormGroup>
          {/* Color ends here */}

          {/* Shapes starts here */}
          <FormGroup>
            <h2 className="text-lg">3. Pick your icon shape.</h2>
            <div className="grid grid-cols-4">
              {shapes.map((shape) => {
                return (
                  <label key={shape} className="flex gap-2 text-xl">
                    <input
                      required
                      type="radio"
                      name="shape"
                      checked={shape === form.shape}
                      onChange={() =>
                        setForm((prev) => ({
                          ...prev,
                          shape,
                        }))
                      }
                    ></input>
                    {shape}
                  </label>
                );
              })}
            </div>
          </FormGroup>
          {/* Shapes ends here */}

          {/* Styles starts here */}
          <FormGroup>
            <h2 className="text-lg">4. Pick your icon style.</h2>
            <div className="grid grid-cols-4">
              {styles.map((style) => {
                return (
                  <label key={style} className="flex gap-2 text-xl">
                    <input
                      required
                      type="radio"
                      name="shape"
                      checked={style === form.style}
                      onChange={() =>
                        setForm((prev) => ({
                          ...prev,
                          style,
                        }))
                      }
                    ></input>
                    {style}
                  </label>
                );
              })}
            </div>
          </FormGroup>
          {/* Styles ends here */}

          {/* Quantity input starts here */}
          <FormGroup>
            <label className="text-lg" htmlFor="numberOfImages">
              5. How many images do you want (1 credit per image), you can
              choose from 1 to 5.
            </label>
            <Input
              required
              inputMode="numeric"
              pattern="[1-5]"
              id="numberOfImages"
              value={form.numberOfIcons}
              onChange={updateForm("numberOfIcons")}
            ></Input>
          </FormGroup>
          {/* Quantity input ends here */}

          {/* Error message occurs when not enough credits */}
          {err && (
            <div className="rounded-md bg-red-500 p-4 text-center text-white">
              {err}
            </div>
          )}

          <Button
            variant="secondary"
            disabled={generateIcon.isLoading}
            isLoading={generateIcon.isLoading}
          >
            Generate Icons
          </Button>
        </form>

        {/* Use Next Image component, we need to give the permission to hit the url */}
        {imagesUrl.length > 0 && (
          <>
            <h2>Your Awesome Icons</h2>
            <section className="gap grid grid-cols-4 gap-4">
              {imagesUrl.map((image) => (
                <Image
                  src={image}
                  key={crypto.randomUUID()}
                  alt="generated image from your prompt"
                  width="512"
                  height="512"
                  className="w-full"
                />
              ))}
            </section>
          </>
        )}

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
