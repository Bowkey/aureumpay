import { useEffect } from "react";

const pageTitles = {
  home: "Aureumpay — Banking, held to a higher standard.",
  about: "About — Aureumpay",
  login: "Log in — Aureumpay",
  register: "Open an account — Aureumpay",
  dashboard: "Dashboard — Aureumpay",
  admin: "Admin — Aureumpay",
};

export default function PageLayout({ page, children }) {
  useEffect(() => {
    document.title = pageTitles[page] ?? "Aureumpay";
    document.body.classList.add("min-h-screen");

    if (["home", "about", "login", "register"].includes(page)) {
      document.body.classList.add("antialiased");
    } else {
      document.body.classList.remove("antialiased");
    }

    if (page !== "home" && page !== "about") return undefined;

    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/6ad8fa28670f5b345e4794f4/1k5fp2c3o";
    script.async = true;
    script.charset = "UTF-8";
    script.crossOrigin = "*";
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    document.body.appendChild(script);

    return () => script.remove();
  }, [page]);

  return children;
}
// <!--Start of Tawk.to Script-->
// <script type="text/javascript">
// var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
// (function(){
// var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
// s1.async=true;
// s1.src='https://embed.tawk.to/6ad8fa28670f5b345e4794f4/1k5fp2c3o';
// s1.charset='UTF-8';
// s1.setAttribute('crossorigin','*');
// s0.parentNode.insertBefore(s1,s0);
// })();
// </script>
// <!--End of Tawk.to Script-->