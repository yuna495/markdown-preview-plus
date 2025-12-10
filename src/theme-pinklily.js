export const getPinkLilyVariables = () => {
    const primary = "#272b2b";
    const secondary = "#171b19";
    const tertiary = "#202020";
    const green = "#11ff84";
    const pinkText = "#fd9bcc";
    const cyanText = "#46d2e8";
    const pinkLine = "#ff0080";
    const purple = "ff14e028";
    const yellow = "#fdd26e";
    const blue = "000080";
    const red = "#ff0000";
    const white = "#ffffff";
    const black = "#000000";
    const grayBorder = "#666666";
    const grayBkg = "#333333";

    return {
        // Base Variables
        "background": primary,
        "mainBkg": primary,
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
        "clusterBkg": tertiary,
        "clusterBorder": green,
        "defaultLinkColor": pinkLine,
        "titleColor": pinkText,
        "edgeLabelBackground": black,

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

        "critBorderColor": "#ffcccc",
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
        "specialStateColor": pinkLine, // End circles etc

        // Class Diagram
        "classText": pinkText,

        // Pie Chart
        "pie1": primary,
        "pie2": secondary,
        "pie3": tertiary,
        "pie4": "#333",
        "pie5": "#444",
        "pie6": "#555",
        "pie7": "#666",
        "pie8": "#777",
        "pie9": "#888",
        "pie10": "#999",
        "pie11": "#aaa",
        "pie12": "#bbb",
        "pieTitleTextColor": pinkText,
        "pieLegendTextColor": pinkText,
        "pieStrokeColor": green,
        "pieStrokeWidth": "2px",
        "pieOuterStrokeWidth": "2px",
        "pieOuterStrokeColor": green,
        "pieOpacity": "0.7",

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
        "git3": red,
        "git4": white,
        "git5": "#888",
        "git6": "#aaa",
        "git7": "#ccc",
        "gitInv0": pinkLine,
        "gitInv1": green,
        "gitInv2": cyanText,
        "gitInv3": red,
        "gitInv4": white,
        "gitInv5": "#888",
        "gitInv6": "#aaa",
        "gitInv7": "#ccc",
        "gitBranchLabel0": white,
        "gitBranchLabel1": white,
        "gitBranchLabel2": white,
        "gitBranchLabel3": white,
        "gitBranchLabel4": white,
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
        "attributeBackgroundColorOdd": tertiary,
        "attributeBackgroundColorEven": secondary
    };
};
