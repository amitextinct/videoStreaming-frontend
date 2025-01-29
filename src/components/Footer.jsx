import vidzyLogo from "../assets/logo/vidzy.svg";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bottom-0 w-full bg-white dark:bg-gray-900">
      <div className="container px-6 py-8 mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <img
              className="w-auto h-7"
              src={vidzyLogo}
              alt="Vidzy Logo"
            />
          </div>
          <p className="max-w-md mx-auto mt-4 text-gray-500 dark:text-gray-400">
            project by Amit Mahto
          </p>
        </div>

        <hr className="my-10 border-gray-200 dark:border-gray-700" />

        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-500">
            © Copyright {currentYear}. All Rights Reserved.
          </p>

          <div className="flex mt-3 -mx-2 sm:mt-0">
            {["Teams", "Privacy", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className="mx-2 text-sm text-gray-500 transition-colors duration-300 hover:text-gray-500 dark:hover:text-gray-300"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
