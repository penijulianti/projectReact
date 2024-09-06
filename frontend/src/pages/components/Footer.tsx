export default function Footer() {
  return (
    <footer className="w-full h-1/6 text-center text-custom-color bg-black bg-opacity-75 z-0">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-evenly items-start">
          <div className="flex flex-col items-start justify-start p-4 w-full md:w-1/3 bg-[#121212] rounded-lg">
            <h3 className="font-semibold text-lg">ZV</h3>
            <p>
              Made with <span className="text-[#BA6573]">❤</span> by Julianti
            </p>
            <p className="text-gray-500 text-sm mt-2">2024 © Peni Julianti</p>
          </div>

          <div className="flex flex-col items-start justify-start p-4 w-full md:w-1/3 bg-[#121212] rounded-lg">
            <p className="mb-2">Need help?</p>
            <p className="mb-4">Contact me here</p>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/in/peni-julianti-a994b7220/"
                target="_blank"
                className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center"
              >
                <img
                  src="https://assets.codepen.io/9051928/codepen_1.png"
                  alt="CodePen"
                  className="h-6 object-cover"
                />
              </a>
              <a
                href="https://twitter.com/juxtoposed"
                target="_blank"
                className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center"
              >
                <img
                  src="https://assets.codepen.io/9051928/x.png"
                  alt="Twitter"
                  className="h-6 object-cover"
                />
              </a>
              <a
                href="https://youtube.com/@juxtoposed"
                target="_blank"
                className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center"
              >
                <img
                  src="https://assets.codepen.io/9051928/youtube_1.png"
                  alt="YouTube"
                  className="h-6 object-cover"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
