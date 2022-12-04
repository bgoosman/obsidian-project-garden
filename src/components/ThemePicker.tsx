import React from "react";

export const ThemePicker = () => (
  <select className="select select-bordered" data-choose-theme>
    {[
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
    ].map((theme) => (
      <option key={theme} value={theme}>
        {theme}
      </option>
    ))}
  </select>
);
