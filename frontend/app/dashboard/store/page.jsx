export default function Store() {
  return (
    <>
      {isLoading ? (
        <div className="min-h-screen w-full bg-white dark:bg-darkBg text-black dark:text-white flex justify-center items-center pt-[60px] md:pl-[20%]">
          {"Loading..."}
        </div>
      ) : (
        <main className="min-h-screen w-full flex flex-col gap-4 bg-bg dark:bg-darkBody font-montserrat pt-[60px] md:pl-[20%] pb-5 text-black dark:text-white">
          <h3>countries </h3>
        </main>
      )}
    </>
  );
}
