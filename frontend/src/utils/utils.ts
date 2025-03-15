import { DateTime } from "luxon";
import { RouteData, RowData } from "../types/types";

export const calculateDepthOfConvoy = (
  numOfVehicles: number,
  distBetweenVehicles: number,
): number => {
  return Number(((numOfVehicles * distBetweenVehicles) - distBetweenVehicles).toFixed(5));
};

export const calculateExtraColumns = (rows: RowData[], routeData: RouteData): RowData[] => {
  const result: RowData[] = [];
  let totalTimeToPassRoute = 0;

  const sumDist: number[] = [];
  const sumTime: number[] = [];
  let prevRow = null;
  let whenPrevConvoyCrossedTheThreshold: DateTime | null = null; // = when X convoy crossed lengthOfRoute
  for (let r = rows.length - 1; r >= 0; r--) {
    const row = rows[r];

    const initialTimeOfEndOfMovement = prevRow ? prevRow.timeOfEndOfMovement : routeData.directiveTimeOfEndOfMovement;

    const depthOfConvoy = calculateDepthOfConvoy(
      row.numOfVehicles,
      row.distBetweenVehicles,
    );

    let timeOfEndOfMovement: DateTime | null = null;
    const timeToExtraIntoDestinationAreaIfNeeded = depthOfConvoy > row.depthOfDestinationArea ? (depthOfConvoy - row.depthOfDestinationArea) / row.speedOfExtraction : 0;
    const timeToGetIntoDestinationArea = (row.depthOfDestinationArea + row.distToDestinationArea) / row.speed;
    // We assume that they all move and start extracting into their own destination areas when they cross lengthOfRoute
    if (whenPrevConvoyCrossedTheThreshold === null) {
      // Revert to when X convoy ended arriving into its own destination area
      whenPrevConvoyCrossedTheThreshold = routeData.directiveTimeOfEndOfMovement.minus({ // prev relative to next convoy in cycle
        hours: timeToExtraIntoDestinationAreaIfNeeded + timeToGetIntoDestinationArea,
      });

      timeOfEndOfMovement = routeData.directiveTimeOfEndOfMovement;
    } else {
      if(!prevRow) throw new Error('prevRow is null');

      // We take previous time when prev convoy ended arriving into its own destination area (which = when it crosses lengthOfRoute)
      // and revert it to moment when start of X + 1 convoy crossed the lengthOfRoute threshold
      whenPrevConvoyCrossedTheThreshold = whenPrevConvoyCrossedTheThreshold.minus({ // prev relative to next convoy in cycle
        hours: (depthOfConvoy + prevRow.distToNextConvoy) / row.speed,
      });

      timeOfEndOfMovement = whenPrevConvoyCrossedTheThreshold.plus({
        hours: timeToGetIntoDestinationArea + timeToExtraIntoDestinationAreaIfNeeded,
      });
    }

    totalTimeToPassRoute =
      (routeData.lengthOfRoute / row.speed) + routeData.stops.reduce((acc, stop) => acc + stop.duration, 0);

    const timeToPassPointOfDeparture_convoyEnd =
      whenPrevConvoyCrossedTheThreshold.minus({
        hours: totalTimeToPassRoute,
      });

    const timeToPassPointOfDeparture_convoyStart = timeToPassPointOfDeparture_convoyEnd.minus({ hours: depthOfConvoy / row.speed });
    const timeOfStartOfMovement = timeToPassPointOfDeparture_convoyStart.minus({
      hours:
        row.distBetweenConvoyHeadAndInitialPointOfDeparture /
        row.speedOfExtraction,
    });

    console.log('@timeToPassPointOfDeparture_convoyStart');
    console.log(timeToPassPointOfDeparture_convoyEnd.toFormat('HH год. mm хв. dd.MM.yyyy'), routeData.stops);

    const stopsData: DateTime[] = [];
    let accStopDuration = 0;
    for (const stop of routeData.stops) {
      accStopDuration += stop.duration;

      stopsData.push(
        timeToPassPointOfDeparture_convoyStart.plus({ hours: (stop.distance / row.speed) + accStopDuration }), // accumulate durations
        timeToPassPointOfDeparture_convoyEnd.plus({ hours: (stop.distance / row.speed) + accStopDuration }),
      );
    }

    const newRow: RowData = {
      ...row,
      depthOfConvoy,
      timeToPassPointOfDeparture_convoyStart, // Час проходження вихідного пункту (Голова колонни) (год. хв.)
      timeToPassPointOfDeparture_convoyEnd, // Час проходження вихідного пункту (Хвіст колонни) (год. хв.)
      timeOfStartOfMovement, // Час початку руху Висування (год. хв.)
      timeOfEndOfMovement, // Директивний час зосередження підрозділів у районі призначення Tзос. (год. хв.)
      stopsData,
    }

    result.push(newRow);
    prevRow = newRow;
  }

  return result.reverse();
}