import { ScreenBreakpoint } from "@/lib/types";

export const BREAKPOINT_VALUES: Record<ScreenBreakpoint, number> = {
    base: 0,
    xs: 400,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
};

// prettier-ignore
export const VALID_TAGS: Set<string> = new Set([ "a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr",
]);

export const HARD_SPACE_WORDS = [
    // Jednoliterowe przyimki
    "a",
    "i",
    "o",
    "u",
    "w",
    "z",

    // Dwuliterowe przyimki często traktowane typograficznie jako wymagające twardej spacji
    "we",
    "za",
    "na",
    "do",
    "od",
    "po",
    "bez",

    // Spójniki
    "albo",
    "lub",
    "czy",
    "więc",
    "lecz",
    "ale",

    // Skróty przed imionami / nazwiskami
    "p.",
    "prof.",
    "dr",
    "mgr",
    "inż.",

    // Skróty wymagające spacji niełamliwej
    "ul.",
    "al.",
    "pl.",
    "nr",
    "poz.",
    "god.",

    "np.",
    "tzn.",
    "tj.",
    "czyt.",
];
