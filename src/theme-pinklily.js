export const getPinkLilyVariables = () => {
    const primary = "#101010ff";
    const secondary = "#202020";
    const tertiary = "#3a3d41";
    const green = "#11ff84";
    const pinkText = "#fd9bcc";
    const cyanText = "#46d2e8";
    const pinkLine = "#ff0080";
    const purple = "#ff14e0";
    const yellow = "#ffd900";
    const orange = "#ffa874"
    const blue = "#00e6bb";
    const red = "#ff0000";
    const white = "#fbd2ffff";
    const black = "#000000";
    const grayBorder = "#666666";
    const grayBkg = "#444444";

    return {
        // Base Variables
        "background": primary,
        "mainBkg": primary,
        "fill": secondary,
        "primaryColor": primary,
        "secondaryColor": secondary,
        "tertiaryColor": tertiary,
        "primaryBorderColor": green,
        "secondaryBorderColor": green,
        "tertiaryBorderColor": green,
        "primaryTextColor": pinkText,
        "secondaryTextColor": pinkText,
        "tertiaryTextColor": pinkText,
        "lineColor": pinkLine,
        "textColor": pinkText,

        "border1": green,
        "border2": green,
        "arrowheadColor": pinkLine,
        "fontFamily": '"Fira Code", "Shippori Mincho", monospace',
        "fontSize": "16px",

        // Nodes & Clusters
        "nodeBkg": primary,
        "nodeBorder": green,
        "nodeTextColor": pinkText,
        "clusterBkg": secondary, // Subgraph Background
        "clusterBorder": green,
        "defaultLinkColor": pinkLine,
        "titleColor": pinkText,
        "edgeLabelBackground": primary,

        // Sequence Diagram
        "actorBorder": green,
        "actorBkg": primary,
        "actorTextColor": pinkText,
        "actorLineColor": green,
        "signalColor": pinkText,
        "signalTextColor": pinkText,
        "labelBoxBkgColor": tertiary,
        "labelBoxBorderColor": green,
        "labelTextColor": pinkText,
        "loopTextColor": pinkText,
        "noteBorderColor": green,
        "noteBkgColor": tertiary,
        "noteTextColor": white,
        "activationBorderColor": pinkLine,
        "activationBkgColor": secondary,
        "sequenceNumberColor": white,

        // Gantt Chart
        "sectionBkgColor": "rgba(39, 43, 43, 0.2)",
        "altSectionBkgColor": "rgba(39, 43, 43, 0.2)",
        "sectionBkgColor2": "rgba(39, 43, 43, 0.2)",
        "excludeBkgColor": "#333",

        "taskBorderColor": green,
        "taskBkgColor": primary,
        "taskTextLightColor": pinkText,
        "taskTextColor": pinkText,
        "taskTextDarkColor": pinkText,
        "taskTextOutsideColor": pinkText,
        "taskTextClickableColor": cyanText,

        "activeTaskBorderColor": cyanText,
        "activeTaskBkgColor": secondary,
        "activeTaskTextColor": cyanText,

        "gridColor": "rgba(17, 255, 132, 0.3)",

        "doneTaskBkgColor": grayBkg,
        "doneTaskBorderColor": grayBorder,
        "doneTaskTextColor": cyanText,

        "critBorderColor": "#ff8080",
        "critBkgColor": red,
        "critTextColor": white,

        "todayLineColor": pinkLine,

        // C4 Context (Person)
        "personBorder": green,
        "personBkg": primary,

        // State Diagram
        "labelColor": pinkText,
        "errorBkgColor": red,
        "errorTextColor": white,
        "scaleLabelColor": pinkText,
        "transitionColor": pinkLine,
        "transitionLabelColor": pinkText,
        "stateLabelColor": pinkText,
        "stateBkg": primary,
        "labelBackgroundColor": tertiary,
        "compositeBackground": tertiary,
        "altBackground": tertiary,
        "compositeTitleBackground": secondary,
        "compositeBorder": green,
        "innerEndBackground": primary,
        "specialStateColor": purple,

        // Class Diagram
        "classText": pinkText,

        // Pie Chart (Vibrant Palette)
        "pie1": pinkLine + "80",   // Pink (Standard)
        "pie2": purple + "80",     // Purple
        "pie3": blue + "80",       // Blue
        "pie4": orange + "80",     // Orange
        "pie5": yellow + "80",     // Yellow
        "pie6": green + "80",      // Green
        "pie7": cyanText + "80",   // Cyan
        "pie8": red + "80",        // Red
        "pie9": white,      // White (Contrast)
        "pie10": primary,   // Dark (Fallback)
        "pie11": secondary,
        "pie12": tertiary,
        "pieTitleTextColor": pinkText,
        "pieLegendTextColor": pinkText,
        "pieStrokeColor": green,
        "pieStrokeWidth": "2px",
        "pieOuterStrokeWidth": "2px",
        "pieOuterStrokeColor": green,
        "pieOpacity": "1.0",

        // Quadrant Chart
        "quadrant1Fill": tertiary,
        "quadrant2Fill": secondary,
        "quadrant3Fill": secondary,
        "quadrant4Fill": tertiary,
        "quadrant1TextFill": pinkText,
        "quadrant2TextFill": pinkText,
        "quadrant3TextFill": pinkText,
        "quadrant4TextFill": pinkText,
        "quadrantPointFill": green,
        "quadrantPointTextFill": pinkText,
        "quadrantXAxisTextFill": pinkText,
        "quadrantYAxisTextFill": pinkText,
        "quadrantInternalBorderStrokeFill": green,
        "quadrantExternalBorderStrokeFill": green,
        "quadrantTitleFill": pinkText,

        // Requirement Diagram
        "requirementBackground": primary,
        "requirementBorderColor": green,
        "requirementBorderSize": "1px",
        "requirementTextColor": pinkText,
        "relationColor": pinkLine,
        "relationLabelBackground": tertiary,
        "relationLabelColor": pinkText,

        // Git Graph
        "git0": pinkLine,
        "git1": green,
        "git2": cyanText,
        "git3": purple,
        "git4": yellow,
        "git5": orange,
        "git6": blue,
        "git7": red,
        // Inverted colors for git (often used for labels or branch lines depending on version)
        "gitInv0": pinkLine,
        "gitInv1": green,
        "gitInv2": cyanText,
        "gitInv3": purple,
        "gitInv4": yellow,
        "gitInv5": orange,
        "gitInv6": blue,
        "gitInv7": red,

        "gitBranchLabel0": black,
        "gitBranchLabel1": black,
        "gitBranchLabel2": black,
        "gitBranchLabel3": black,
        "gitBranchLabel4": black,
        "gitBranchLabel5": black,
        "gitBranchLabel6": black,
        "gitBranchLabel7": black,

        "tagLabelColor": cyanText,
        "tagLabelBackground": primary,
        "tagLabelBorder": green,
        "tagLabelFontSize": "10px",
        "commitLabelColor": pinkText,
        "commitLabelBackground": tertiary,
        "commitLabelFontSize": "10px",

        // Other / Generic
        "hoverChanged": green,
        "attributeBackgroundColorOdd": primary,
        "attributeBackgroundColorEven": secondary
    };
};
