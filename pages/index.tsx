import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { EnvelopeIcon, PhoneIcon, UserIcon } from "@heroicons/react/24/outline";
import Logo from "../components/Icons/Logo";
import Modal from "../components/Modal";
import cloudinary from "../utils/cloudinary";
import getBase64ImageUrl from "../utils/generateBlurPlaceholder";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";

const Home: NextPage = ({ images }: { images: ImageProps[] }) => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <>
      <Head>
        <title>MF Profissional - Galeria</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/db304aaga/image/upload/v1772480031/header_cr7lop.png"
        />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/db304aaga/image/upload/v1772480031/header_cr7lop.png"
        />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            images={images}
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
        <div className="relative mb-5 flex h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-black text-center text-white shadow-highlight">
          <Image
            src="https://res.cloudinary.com/db304aaga/image/upload/v1772480031/header_cr7lop.png"
            alt="Header Background"
            className="object-cover opacity-60"
            fill
            priority
            unoptimized
          />
          <div className="relative z-10 flex flex-col items-center">
            <Logo />
            <h1 className="mt-8 mb-4 text-base font-bold uppercase tracking-widest text-center">
              4.° Congresso MF Profissional<br />
              - Edição Internacional, em Aveiro
            </h1>
            <p className="max-w-[40ch] text-white/75 sm:max-w-[32ch] mx-auto">
              Galeria online e portfólio de imagens.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {images.map(({ id, public_id, format, blurDataUrl }) => (
            <Link
              key={id}
              href={`/?photoId=${id}`}
              as={`/p/${id}`}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              shallow
              className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <Image
                alt="Next.js Conf photo"
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: "translate3d(0, 0, 0)" }}
                placeholder={blurDataUrl ? "blur" : "empty"}
                blurDataURL={blurDataUrl || undefined}
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
              />
            </Link>
          ))}
        </div>
      </main>
      <footer className="p-6 sm:p-12 flex justify-end">
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span>Por Gil Ribeiro</span>
          </div>
          <span className="hidden sm:inline">-</span>
          <div className="flex items-center gap-2">
            <EnvelopeIcon className="h-4 w-4" />
            <a href="mailto:ribeiro.gil4@gmail.com" className="hover:text-white transition-colors">
              ribeiro.gil4@gmail.com
            </a>
          </div>
          <span className="hidden sm:inline">-</span>
          <div className="flex items-center gap-2">
            <PhoneIcon className="h-4 w-4" />
            <a href="tel:+351933667482" className="hover:text-white transition-colors">
              933667482
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by("public_id", "asc")
    .max_results(400)
    .execute();
  let reducedResults: ImageProps[] = [];

  let i = 0;
  for (let result of results.resources) {
    reducedResults.push({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
    });
    i++;
  }

  const blurImagePromises = results.resources.map((image: ImageProps) => {
    return getBase64ImageUrl(image);
  });
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i];
  }

  return {
    props: {
      images: reducedResults,
    },
  };
}
