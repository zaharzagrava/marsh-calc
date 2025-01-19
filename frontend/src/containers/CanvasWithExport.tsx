import { Button } from "@mui/material";
import { Grid } from "@mui/material";
import { Coordinates, mainImageTypes, topImageTypes, Route } from "../types/types";
import { useRef, useCallback } from "react";
import svgFromPath from "./svgFromPath";

const CanvasWithExport = ({ routes }: { routes: Route[] }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const exportToPNG = useCallback(() => {
    const svgElement = svgRef.current;

    if (!svgElement) return;

    // Clone the SVG to avoid modifying the original
    const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
    
    // Convert all image elements' href to base64
    const imageElements = svgClone.getElementsByTagName('image');
    const loadImages = Array.from(imageElements).map((img) => {
      return new Promise<void>((resolve) => {
        const imgElement = img as SVGImageElement;
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          const reader = new FileReader();
          reader.onloadend = function() {
            imgElement.setAttribute('href', reader.result as string);
            resolve();
          };
          reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', imgElement.href.baseVal);
        xhr.responseType = 'blob';
        xhr.send();
      });
    });

    Promise.all(loadImages).then(() => {
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const img = new Image();

      // Set canvas size to match the SVG size
      const { width, height } = svgElement.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;

      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        const pngData = canvas.toDataURL("image/png");

        // Create a download link
        const link = document.createElement("a");
        link.download = "canvas-export.png";
        link.href = pngData;
        link.click();
      };

      // Convert SVG data to Base64 URI, handling non-Latin1 characters
      const encodedData = encodeURIComponent(svgData);
      img.src = `data:image/svg+xml;charset=utf-8,${encodedData}`;
    });
  }, []);

  return (
    <Grid item>
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="1000px"
        style={{ border: "1px solid black" }}
      >

        {(() => {
          const elements = [];

          const initialOffset = {
            x: 50,
            y: 150,
          };

          const divisionWidth = 120;
          const divisionHeight = 75;
          const rectBottomOffset = 30;
          const rectBottomOffset2 = 60;

          const groupMarginX = 25;
          const groupMarginY = 100;

          const groupOffset: Coordinates = {
            x: initialOffset.x,
            y: initialOffset.y,
          };

          // groupsInfo in all routes are the same, and also synced with groups in formik
          let lastGroupHeight = 0;
          for (
            let groupIndex = 0;
            groupIndex < routes[0].groupsInfo.length;
            groupIndex++
          ) {

            const groupWidths = [];
            const allRoutesDivisions = [];
            for (let index = 0; index < routes.length; index++) {
              const groupDivisions = routes[index].groupsInfo[
                groupIndex
              ].rows.map((row) => routes[index].rows[row]);
              allRoutesDivisions.push(groupDivisions);

              const groupWidth =
                groupDivisions.length * divisionWidth +
                Math.max(groupDivisions.length + 1, 2) * groupMarginX;
              groupWidths.push(groupWidth);
            }

            const groupWidth = Math.max(...groupWidths);
            const groupHeight =
              divisionHeight +
              rectBottomOffset2 +
              groupMarginY * 2 +
              (routes.length > 1
                ? divisionHeight + rectBottomOffset2 + groupMarginY
                : 0);

            lastGroupHeight = groupHeight;

            const rects = [];
            for (let index = 0; index < allRoutesDivisions.length; index++) {
              const groupDivisions = allRoutesDivisions[index];
              const groupWidth = groupWidths[index];

              const offset = {
                x: groupOffset.x,
                y:
                  groupOffset.y +
                  groupMarginY +
                  index * (divisionHeight + rectBottomOffset2 + groupMarginY),
              };

              for (
                let rowIndex = 0;
                rowIndex < groupDivisions.length;
                rowIndex++
              ) {
                const divisionX =
                  offset.x + groupMarginX + (rowIndex > 0 ? divisionWidth : 0);
                const divisionY = offset.y;

                const divisionMainImageTypes = mainImageTypes.filter(t => groupDivisions[rowIndex].mainImageTypes?.includes(t.type));
                const divisionTopImageType = topImageTypes.find(t => t.type === groupDivisions[rowIndex].topImageType);

                // Render all main image types
                const mainImages = divisionMainImageTypes.map((imageType, i) => (
                  <image
                    key={`main-${i}`}
                    href={svgFromPath(imageType.svgPath) || ''}
                    x={divisionX}
                    y={divisionY}
                    width={divisionWidth}
                    height={divisionHeight}
                  />
                ));

                // Render all top image types
                const topImages = [divisionTopImageType].map((imageType, i) => (
                  <image
                    key={`top-${i}`}
                    href={svgFromPath(imageType?.svgPath) || ''}
                    x={divisionX}
                    y={divisionY - divisionHeight + 23}
                    width={divisionWidth}
                    height={divisionHeight}
                  />
                ));
  
                const texts = [
                  // Left bottom amplificator
                  <text
                    key="left-bottom"
                    x={divisionX - 10}
                    y={divisionY + divisionHeight}
                    fill="black"
                    fontSize="14"
                    textAnchor="start"
                  >
                    {groupDivisions[rowIndex].leftBottomAmplificator || ''}
                  </text>,

                  // Center bottom amplificator  
                  <text
                    key="center-bottom"
                    x={divisionX + divisionWidth / 2}
                    y={divisionY + divisionHeight - 5}
                    fill="black"
                    fontSize="14"
                    textAnchor="middle"
                  >
                    {groupDivisions[rowIndex].centerBottomAmplificator || ''}
                  </text>,

                  // Right bottom amplificator
                  <text
                    key="right-bottom" 
                    x={divisionX + divisionWidth + 10}
                    y={divisionY + divisionHeight}
                    fill="black"
                    fontSize="14"
                    textAnchor="end"
                  >
                    {groupDivisions[rowIndex].rightBottomAmplificator || ''}
                  </text>,

                  // Left top amplificator
                  <text
                    key="left-top"
                    x={divisionX - 10}
                    y={divisionY + 10}
                    fill="black"
                    fontSize="14"
                    textAnchor="start"
                  >
                    {groupDivisions[rowIndex].leftTopAmplificator || ''}
                  </text>,

                  // Right top amplificator
                  <text
                    key="right-top"
                    x={divisionX + divisionWidth + 10}
                    y={divisionY + 10}
                    fill="black"
                    fontSize="14"
                    textAnchor="end"
                  >
                    {groupDivisions[rowIndex].rightTopAmplificator || ''}
                  </text>,

                  // Center top amplificator
                  <text
                    key="center-top"
                    x={divisionX + divisionWidth / 2}
                    y={divisionY + 15}
                    fill="black"
                    fontSize="14"
                    textAnchor="middle"
                  >
                    {groupDivisions[rowIndex].centerTopAmplificator || ''}
                  </text>,

                  // Left amplificator
                  <text
                    key="left"
                    x={divisionX - 10}
                    y={divisionY + (divisionHeight / 2) + 5}
                    fill="black"
                    fontSize="14"
                    textAnchor="start"
                  >
                    {groupDivisions[rowIndex].leftAmplificator || ''}
                  </text>,

                  // Right amplificator
                  <text
                    key="right"
                    x={divisionX + divisionWidth + 10}
                    y={divisionY + (divisionHeight / 2) + 5}
                    fill="black"
                    fontSize="14"
                    textAnchor="end"
                  >
                    {groupDivisions[rowIndex].rightAmplificator || ''}
                  </text>,

                  // Center amplificator
                  <text
                    key="center"
                    x={divisionX + divisionWidth / 2}
                    y={divisionY + (divisionHeight / 2) + 5}
                    fill="black"
                    fontSize="14"
                    textAnchor="middle"
                  >
                    {groupDivisions[rowIndex].centerAmplificator || ''}
                  </text>,
                ];

                rects.push(
                  <g
                    key={`${routes[0].groupsInfo[groupIndex].name}-${index}-${rowIndex}`}
                  >
                    {mainImages}
                    {topImages}
                    {texts}
                    {/* Blue vertical line */}
                    <line
                      x1={divisionX + divisionWidth / 2}
                      y1={divisionY + divisionHeight}
                      x2={divisionX + divisionWidth / 2}
                      y2={divisionY + divisionHeight + rectBottomOffset}
                      stroke="blue"
                      strokeWidth="3"
                    />
                    {/* Blue horizontal line */}
                    <line
                      x1={divisionX}
                      y1={divisionY + divisionHeight + rectBottomOffset}
                      x2={divisionX + divisionWidth - 10}
                      y2={divisionY + divisionHeight + rectBottomOffset}
                      stroke="blue"
                      strokeWidth="3"
                    />
                    <polygon
                      points={`${divisionX},${divisionY + divisionHeight + rectBottomOffset} ${divisionX + divisionWidth - 20},${divisionY + divisionHeight + rectBottomOffset} ${divisionX + divisionWidth - 20},${divisionY + divisionHeight + rectBottomOffset - 5} ${divisionX + divisionWidth},${divisionY + divisionHeight + rectBottomOffset} ${divisionX + divisionWidth - 20},${divisionY + divisionHeight + rectBottomOffset + 5} ${divisionX + divisionWidth - 20},${divisionY + divisionHeight + rectBottomOffset}`}
                      fill="blue"
                    />
                    <text
                      x={divisionX + divisionWidth / 2}
                      y={divisionY + divisionHeight + rectBottomOffset + 20}
                      fill="black"
                      fontSize="18"
                      textAnchor="middle"
                    >
                      {groupDivisions[rowIndex].numOfVehicles}
                    </text>
                    {/* Black vertical line */}
                    <line
                      x1={divisionX}
                      y1={divisionY + divisionHeight + rectBottomOffset}
                      x2={divisionX}
                      y2={divisionY + divisionHeight + rectBottomOffset2 + 15}
                      stroke="black"
                      strokeWidth="1"
                    />
                    <line
                      x1={divisionX + divisionWidth}
                      y1={divisionY + divisionHeight + rectBottomOffset}
                      x2={divisionX + divisionWidth}
                      y2={divisionY + divisionHeight + rectBottomOffset2 + 15}
                      stroke="black"
                      strokeWidth="1"
                    />
                    {/* Two black arrows */}
                    <polygon
                      points={`${divisionX},${divisionY + divisionHeight + rectBottomOffset2} ${divisionX + divisionWidth - 20},${divisionY + divisionHeight + rectBottomOffset2} ${divisionX + divisionWidth - 20},${divisionY + divisionHeight + rectBottomOffset2 - 5} ${divisionX + divisionWidth},${divisionY + divisionHeight + rectBottomOffset2} ${divisionX + divisionWidth - 20},${divisionY + divisionHeight + rectBottomOffset2 + 5} ${divisionX + divisionWidth - 20},${divisionY + divisionHeight + rectBottomOffset2}`}
                      fill="black"
                    />
                    <polygon
                      points={`${divisionX},${divisionY + divisionHeight + rectBottomOffset2} ${divisionX + 20},${divisionY + divisionHeight + rectBottomOffset2} ${divisionX + 20},${divisionY + divisionHeight + rectBottomOffset2 - 5} ${divisionX},${divisionY + divisionHeight + rectBottomOffset2} ${divisionX + 20},${divisionY + divisionHeight + rectBottomOffset2 + 5} ${divisionX + 20},${divisionY + divisionHeight + rectBottomOffset2}`}
                      fill="black"
                    />
                    {/* Black horizontal line */}
                    <line
                      x1={divisionX}
                      y1={divisionY + divisionHeight + rectBottomOffset2}
                      x2={divisionX + divisionWidth - 10}
                      y2={divisionY + divisionHeight + rectBottomOffset2}
                      stroke="black"
                      strokeWidth="2"
                    />
                    <text
                      x={divisionX + divisionWidth / 2}
                      y={divisionY + divisionHeight + rectBottomOffset2 + 20}
                      fill="black"
                      fontSize="18"
                      textAnchor="middle"
                    >
                      {groupDivisions[rowIndex].depthOfConvoy}
                    </text>
                    <text
                      x={(() => {
                        const x = divisionX + divisionWidth + 15;
                        const isLastDivision = rowIndex === groupDivisions.length - 1;
                        if(isLastDivision) {
                          return x + 23; // doesnt matter cause number is not present
                        }

                        return x;
                      })()}
                      y={divisionY + divisionHeight + rectBottomOffset2 + 35}
                      fill="black"
                      fontSize="18"
                      textAnchor="middle"
                    >
                      {groupDivisions[rowIndex].distToNextConvoy}
                    </text>
                  </g>
                );

                offset.x = divisionX;
                offset.y = divisionY;
              }
            }

            elements.push(
              <g key={groupIndex}>
                {/* Group name text */}
                <text
                  x={groupOffset.x - 5}
                  y={groupOffset.y - 15}
                  fill="black"
                  fontSize="18"
                  textAnchor="start"
                >
                  {routes[0].groupsInfo[groupIndex].name}
                </text>
                {/* Black dashed rectangle */}
                <rect
                  x={groupOffset.x}
                  y={groupOffset.y}
                  width={groupWidth}
                  height={groupHeight}
                  fill="none"
                  stroke="black"
                  strokeWidth="2.5"
                  strokeDasharray="27,17"
                />
                {rects}
              </g>
            );

            groupOffset.x += groupWidth + groupMarginX;
          }

          const rightMargin = 50;
          const pointyOffset = 10;
          elements.push(
            <path
              key="blue-arrow"
              d={`M ${initialOffset.x - 10} ${initialOffset.y - 100}
                  L ${groupOffset.x + rightMargin} ${initialOffset.y - 100}
                  L ${groupOffset.x + rightMargin} ${initialOffset.y - 100 - pointyOffset}
                  L ${groupOffset.x + rightMargin + 20} ${initialOffset.y - 100 + (groupOffset.y + lastGroupHeight + 120)/2}
                  L ${groupOffset.x + rightMargin} ${initialOffset.y - 100 + groupOffset.y + lastGroupHeight + 20 + pointyOffset}
                  L ${groupOffset.x + rightMargin} ${initialOffset.y - 100 + groupOffset.y + lastGroupHeight + 20}
                  L ${initialOffset.x - 10} ${initialOffset.y - 100 + groupOffset.y + lastGroupHeight + 20}
                  Z`}
              fill="none"
              stroke="blue" 
              strokeWidth="3"
            />
          )

          return elements;
        })()}
      </svg>
      <Button
        variant="contained"
        onClick={exportToPNG}
        style={{ marginTop: "10px" }}
      >
        Export to PNG
      </Button>
    </Grid>
  );
};

export default CanvasWithExport;