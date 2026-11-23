// Personal details used across the site.
export const site = {
  name: "Anjali Gupta",
  city: "Howrah, India",
  email: "2021anjaligupta26@gmail.com",
  github: "https://github.com/ItsAN-11",
  linkedin: "https://www.linkedin.com/in/anjali-gupta-0318b9264",
  // resume.pdf: plain-text links (download, ATS). resume-view.pdf: icon links (opened in the browser).
  resume: "/resume.pdf",
  resumeView: "/resume-view.pdf",
  // Show the Netflix resume (/cinema)
  showCinema: false,
  // What you're watching right now (hidden when empty)
  currentlyInto: "",
  spotify: "https://open.spotify.com/playlist/6jw0VaOzkTbH7iRS2LyC3A",
  upi: {
    id: "2021anjaligupta26@oksbi",
    payee: "Anjali Gupta",
    amount: 25,
    item: "Adrak elaichi chai",
  },
};

export function upiLink(note = "") {
  const { id, payee, amount, item } = site.upi;
  const tn = (note.trim() ? `${item} - ${note.trim()}` : item).slice(0, 80);
  return (
    `upi://pay?pa=${id}&pn=${encodeURIComponent(payee)}` +
    `&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(tn)}`
  );
}
