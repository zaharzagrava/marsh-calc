import { Button } from "@mui/material";
import { Grid } from "@mui/material";
import {
  Coordinates,
  mainImageTypes,
  topImageTypes,
  Route,
} from "../types/types";
import { useRef, useCallback } from "react";
import svgFromPath from "./svgFromPath";

interface RenderDivisionParams {
  division: any; // Replace with proper type
  divisionX: number;
  divisionY: number;
  divisionWidth: number;
  divisionHeight: number;
  rectBottomOffset: number;
  rectBottomOffset2: number;
  groupIndex: number;
  isLastDivision: boolean;
  indexStr: string;
  routes: Route[];
  skipBlackLines?: boolean;
}

const renderDivision = ({
  division,
  divisionX,
  divisionY: paramDivisionY,
  divisionWidth,
  divisionHeight,
  rectBottomOffset,
  rectBottomOffset2,
  groupIndex,
  isLastDivision,
  indexStr,
  routes,
  skipBlackLines,
}: RenderDivisionParams) => {
  const divisionY = paramDivisionY - (division.isUplifted ? 20 : 0);
  const divisionMainImageTypes = mainImageTypes.filter((t) =>
    division.mainImageTypes?.includes(t.type)
  );
  const divisionTopImageType = topImageTypes.find(
    (t) => t.type === division.topImageType
  );

  const mainImages = divisionMainImageTypes.map((imageType, i) => (
    <image
      key={`main-${i}`}
      href={svgFromPath(imageType.svgPath) || ""}
      x={divisionX}
      y={divisionY}
      width={divisionWidth}
      height={divisionHeight}
    />
  ));

  if(divisionTopImageType) {
    mainImages.push(
      <image
        key={`top`}
        href={svgFromPath(divisionTopImageType?.svgPath) || ""}
        x={divisionX}
        y={divisionY - divisionHeight + 23}
        width={divisionWidth}
        height={divisionHeight}
      />
    );
  }

  const texts = [
    // Left top amplificator
    <text
      key="left-top"
      x={divisionX - 5}
      y={divisionY + 10}
      fill="black"
      fontSize="14"
      textAnchor="end"
    >
      {division.leftTopAmplificator || ""}
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
      {division.centerTopAmplificator || ""}
    </text>,

    // Right top amplificator
    <text
      key="right-top"
      x={divisionX + divisionWidth + 5}
      y={divisionY + 10}
      fill="black"
      fontSize="14"
      textAnchor="start"
    >
      {division.rightTopAmplificator || ""}
    </text>,

    // Left amplificator
    <text
      key="left"
      x={divisionX - 5}
      y={divisionY + divisionHeight / 2 + 5}
      fill="black"
      fontSize="14"
      textAnchor="end"
    >
      {division.leftAmplificator || ""}
    </text>,

    // Center amplificator
    <text
      key="center"
      x={divisionX + divisionWidth / 2}
      y={divisionY + divisionHeight / 2 + 5}
      fill="black"
      fontSize="14"
      textAnchor="middle"
    >
      {division.centerAmplificator || ""}
    </text>,

    // Right amplificator
    <text
      key="right"
      x={divisionX + divisionWidth + 5}
      y={divisionY + divisionHeight / 2 + 5}
      fill="black"
      fontSize="14"
      textAnchor="start"
    >
      {division.rightAmplificator || ""}
    </text>,

    // Left bottom amplificator
    <text
      key="left-bottom"
      x={divisionX - 5}
      y={divisionY + divisionHeight}
      fill="black"
      fontSize="14"
      textAnchor="end"
    >
      {division.leftBottomAmplificator || ""}
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
      {division.centerBottomAmplificator || ""}
    </text>,

    // Right bottom amplificator
    <text
      key="right-bottom"
      x={divisionX + divisionWidth + 5}
      y={divisionY + divisionHeight}
      fill="black"
      fontSize="14"
      textAnchor="start"
    >
      {division.rightBottomAmplificator || ""}
    </text>,
  ];

  return (
    <g key={`${routes[0].groupsInfo[groupIndex].name}-${indexStr}`}>
      {mainImages}
      {texts}
      {/* Blue vertical line */}
      <line
        x1={divisionX + (division.isUplifted ? 0 : divisionWidth / 2) + 1}
        y1={divisionY + divisionHeight - (division.isUplifted ? 3 : 0)}
        x2={divisionX + (division.isUplifted ? 0 : divisionWidth / 2) + 1}
        y2={paramDivisionY + divisionHeight + rectBottomOffset}
        stroke="blue"
        strokeWidth="2"
      />
      {/* Blue horizontal line */}
      <line
        x1={divisionX}
        y1={paramDivisionY + divisionHeight + rectBottomOffset}
        x2={divisionX + divisionWidth - 10}
        y2={paramDivisionY + divisionHeight + rectBottomOffset}
        stroke="blue"
        strokeWidth="2"
      />
      <polygon
        points={`${divisionX},${paramDivisionY + divisionHeight + rectBottomOffset} ${divisionX + divisionWidth - 20},${paramDivisionY + divisionHeight + rectBottomOffset} ${divisionX + divisionWidth - 20},${paramDivisionY + divisionHeight + rectBottomOffset - 5} ${divisionX + divisionWidth},${paramDivisionY + divisionHeight + rectBottomOffset} ${divisionX + divisionWidth - 20},${paramDivisionY + divisionHeight + rectBottomOffset + 5} ${divisionX + divisionWidth - 20},${paramDivisionY + divisionHeight + rectBottomOffset}`}
        fill="blue"
      />
      <text
        x={divisionX + divisionWidth / 2}
        y={paramDivisionY + divisionHeight + rectBottomOffset + 20}
        fill="black"
        fontSize="18"
        textAnchor="middle"
      >
        {division.numOfVehicles}
      </text>
      {!skipBlackLines && (
        <>
          {/* Black vertical line */}
          <line
            x1={divisionX}
            y1={paramDivisionY + divisionHeight + rectBottomOffset}
            x2={divisionX}
            y2={paramDivisionY + divisionHeight + rectBottomOffset2 + 15}
            stroke="black"
            strokeWidth="1"
          />
          <line
            x1={divisionX + divisionWidth}
            y1={paramDivisionY + divisionHeight + rectBottomOffset}
            x2={divisionX + divisionWidth}
            y2={paramDivisionY + divisionHeight + rectBottomOffset2 + 15}
            stroke="black"
            strokeWidth="1"
          />
          {/* Two black arrows */}
          <polygon
            points={`${divisionX},${paramDivisionY + divisionHeight + rectBottomOffset2} ${divisionX + divisionWidth - 20},${paramDivisionY + divisionHeight + rectBottomOffset2} ${divisionX + divisionWidth - 20},${paramDivisionY + divisionHeight + rectBottomOffset2 - 5} ${divisionX + divisionWidth},${paramDivisionY + divisionHeight + rectBottomOffset2} ${divisionX + divisionWidth - 20},${paramDivisionY + divisionHeight + rectBottomOffset2 + 5} ${divisionX + divisionWidth - 20},${paramDivisionY + divisionHeight + rectBottomOffset2}`}
            fill="black"
          />
          <polygon
            points={`${divisionX},${paramDivisionY + divisionHeight + rectBottomOffset2} ${divisionX + 20},${paramDivisionY + divisionHeight + rectBottomOffset2} ${divisionX + 20},${paramDivisionY + divisionHeight + rectBottomOffset2 - 5} ${divisionX},${paramDivisionY + divisionHeight + rectBottomOffset2} ${divisionX + 20},${paramDivisionY + divisionHeight + rectBottomOffset2 + 5} ${divisionX + 20},${paramDivisionY + divisionHeight + rectBottomOffset2}`}
            fill="black"
          />
          {/* Black horizontal line */}
          <line
            x1={divisionX}
            y1={paramDivisionY + divisionHeight + rectBottomOffset2}
            x2={divisionX + divisionWidth - 10}
            y2={paramDivisionY + divisionHeight + rectBottomOffset2}
            stroke="black"
            strokeWidth="2"
          />
          <text
            x={divisionX + divisionWidth / 2}
            y={paramDivisionY + divisionHeight + rectBottomOffset2 + 20}
            fill="black"
            fontSize="18"
            textAnchor="middle"
          >
            {division.depthOfConvoy}
          </text>
          {division.distToNextConvoy && (
            <text
              x={(() => {
                const x = divisionX + divisionWidth + 15;
                if (isLastDivision) {
                  return x + 37; // doesnt matter cause number is not present
                }

                return x;
              })()}
              y={paramDivisionY + divisionHeight + rectBottomOffset2 + 35}
              fill="black"
              fontSize="18"
              textAnchor="middle"
            >
              {division.distToNextConvoy}
            </text>
          )}
        </>
      )}
    </g>
  );
};

const CanvasWithExport = ({ routes }: { routes: Route[] }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const exportToPNG = useCallback(() => {
    const svgElement = svgRef.current;

    if (!svgElement) return;

    // Clone the SVG to avoid modifying the original
    const svgClone = svgElement.cloneNode(true) as SVGSVGElement;

    // Convert all image elements' href to base64
    const imageElements = svgClone.getElementsByTagName("image");
    const loadImages = Array.from(imageElements).map((img) => {
      return new Promise<void>((resolve) => {
        const imgElement = img as SVGImageElement;
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          const reader = new FileReader();
          reader.onloadend = function () {
            imgElement.setAttribute("href", reader.result as string);
            resolve();
          };
          reader.readAsDataURL(xhr.response);
        };
        xhr.open("GET", imgElement.href.baseVal);
        xhr.responseType = "blob";
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
        height="1400px"
        style={{ border: "1px solid black" }}
      >
        {(() => {
          console.log('@ ---------------------------- @');

          const elements = [];

          const initialOffset = {
            x: 50,
            y: 50,
          };

          const divisionWidth = 120;
          const divisionHeight = 75;
          const rectBottomOffset = 30;
          const rectBottomOffset2 = 60;

          const groupMarginX = 35;
          const groupMarginY = 100;

          const groupFromInitialOffsetY = 100;
          const doesTopRouteHasAdditionalDivision = routes[0].rows.find(r => r.additionalDivision);
          const additionalDivisionsHeight =
            (doesTopRouteHasAdditionalDivision ? 1 : 0) * divisionHeight +
            100;
          const groupOffset: Coordinates = {
            x: initialOffset.x,
            y:
              initialOffset.y +
              groupFromInitialOffsetY +
              additionalDivisionsHeight,
          };

          // groupsInfo in all routes are the same, and also synced with groups in formik
          let lastGroupHeight = 0;

          let firstAdditionalDivisionX = null;
          let lastAdditionalDivisionX = null;
          for (let gi = routes[0].groupsInfo.length - 1; gi >= 0; gi--) {
            const { allRoutesWidths, allRoutesDivisions } = (() => {
              const allRoutesWidths = [];
              const allRoutesDivisions = [];
              for (let index = 0; index < routes.length; index++) {
                const divisions = routes[index].groupsInfo[gi].rows.map(
                  (row) => routes[index].rows[row]
                ).reverse();

                allRoutesDivisions.push({ divisions });
  
                const groupWidth =
                  divisions.length * divisionWidth +
                  Math.max(divisions.length + 1, 2) * groupMarginX;
                allRoutesWidths.push(groupWidth);
              }

              return { allRoutesWidths, allRoutesDivisions };
            })();

            const groupWidth = Math.max(...allRoutesWidths);
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
              const topRoute = index === 0;
              const additionalDivisionsOffsetY =  (() => {
                if(topRoute) {
                  return initialOffset.y + (groupFromInitialOffsetY / 2) + 35;
                }

                return groupOffset.y + groupHeight + 100;
              })();

              const { divisions } = allRoutesDivisions[index];

              const offset = {
                x: groupOffset.x,
                y:
                  groupOffset.y +
                  groupMarginY +
                  index * (divisionHeight + rectBottomOffset2 + groupMarginY),
              };

              // Painting group divisions
              for (let d = 0; d < divisions.length; d++) {
                const division = divisions[d];

                if(!division) continue;

                const divisionX =
                  offset.x + groupMarginX + (d > 0 ? divisionWidth : 0);
                const divisionY = offset.y;

                const isLastDivision = d === divisions.length - 1;

                rects.push(
                  renderDivision({
                    division,
                    divisionX,
                    divisionY,
                    divisionWidth,
                    divisionHeight,
                    rectBottomOffset,
                    rectBottomOffset2,
                    groupIndex: gi,
                    isLastDivision,
                    indexStr: `${index}-${d}`,
                    routes,
                  })
                );

                if(division.additionalDivision) {
                  firstAdditionalDivisionX = firstAdditionalDivisionX ? Math.min(firstAdditionalDivisionX, divisionX) : divisionX;
                  lastAdditionalDivisionX = lastAdditionalDivisionX ? Math.max(lastAdditionalDivisionX, divisionX) : divisionX;

                  rects.push(
                    renderDivision({
                      division: division.additionalDivision,
                      divisionX,
                      divisionY: additionalDivisionsOffsetY,
                      divisionWidth,
                      divisionHeight,
                      rectBottomOffset,
                      rectBottomOffset2,
                      groupIndex: gi,
                      isLastDivision: false,
                      indexStr: `${index}-${d}-additional`,
                      routes,
                      skipBlackLines: true,
                    })
                  );
                }

                offset.x = divisionX;
                offset.y = divisionY;
              }

              if(gi === 0) {
                // Paint index of route with cicrcle around it
                rects.push(
                  <>
                  <text
                    x={offset.x + divisionWidth + (groupMarginX * 2)}
                    y={offset.y + (divisionHeight / 2) + 2}
                    fill="black"
                    fontSize="18"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {index + 1}
                  </text>
                    <circle
                      cx={offset.x + divisionWidth + (groupMarginX * 2)}
                      cy={offset.y + (divisionHeight / 2)}
                      r={15}
                      fill="none"
                      stroke="blue"
                      strokeWidth="2"
                    />
                  </>
                );
              }

              const doesThisRouteHasAdditionalDivision = !!routes[index].rows.find(r => r.additionalDivision);
              if(doesThisRouteHasAdditionalDivision && gi === 0 && firstAdditionalDivisionX && lastAdditionalDivisionX) {
                if(topRoute) {
                  // topRoute check is so that we offset those values only once
                  firstAdditionalDivisionX = firstAdditionalDivisionX - groupMarginX;
                  lastAdditionalDivisionX = lastAdditionalDivisionX + groupMarginX + divisionWidth;
                }

                const groupWidth = lastAdditionalDivisionX - firstAdditionalDivisionX;

                rects.push(
                  <>
                    <rect
                      x={firstAdditionalDivisionX}
                      y={additionalDivisionsOffsetY - 35}
                      width={groupWidth}
                      height={divisionHeight + 80}
                      fill="none"
                      stroke="black"
                      strokeWidth="2.5"
                      strokeDasharray="27,17"
                    />
                    <text
                      x={firstAdditionalDivisionX}
                      y={additionalDivisionsOffsetY - 55}
                      fill="black"
                      fontSize="18"
                      textAnchor="start"
                    >
                      {routes[index].additionalDivisionName}
                    </text>
                  </>
                );
              }
            }

            elements.push(
              <g key={gi}>
                {/* Group name text */}
                <text
                  x={groupOffset.x - 5}
                  y={groupOffset.y - 15}
                  fill="black"
                  fontSize="18"
                  textAnchor="start"
                >
                  {routes[0].groupsInfo[gi].name}
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
          const isLastRouteHasAdditionalDivision = routes[1]?.additionalDivisionName;
          const adjustedLastGroupHeight = lastGroupHeight + (isLastRouteHasAdditionalDivision ? 225 : 0);
          elements.push(
            <>
              <text
                x={initialOffset.x + ((groupOffset.x - rightMargin) / 2)}
                y={initialOffset.y - 10}
                fill="black"
                fontSize="18"
                textAnchor="middle"
              >
                ПОБУДОВА ПОХІДНОГО ПОРЯДКУ
              </text>
              <path
                key="blue-arrow"
                d={`M ${initialOffset.x - 10} ${initialOffset.y}
                    L ${groupOffset.x + rightMargin} ${initialOffset.y}
                    L ${groupOffset.x + rightMargin} ${initialOffset.y - pointyOffset}
                    L ${groupOffset.x + rightMargin + 20} ${(groupOffset.y + adjustedLastGroupHeight + 120) / 2}
                    L ${groupOffset.x + rightMargin} ${groupOffset.y + adjustedLastGroupHeight + 20 + pointyOffset}
                    L ${groupOffset.x + rightMargin} ${groupOffset.y + adjustedLastGroupHeight + 20}
                    L ${initialOffset.x - 10} ${groupOffset.y + adjustedLastGroupHeight + 20}
                    Z`}
                fill="none"
                stroke="blue"
                strokeWidth="3"
              />
            </>
          );

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
