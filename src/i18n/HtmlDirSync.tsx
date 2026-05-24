"use client";

import { useEffect } from "react";
import { useLang } from "./index";

export default function HtmlDirSync() {
  const { lang, dir } = useLang();
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);
  return null;
}
