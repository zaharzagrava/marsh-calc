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
  for (let r = rows.length - 1; r >= 0; r--) {
    const row = rows[r];

    const initialTimeOfEndOfMovement = prevRow ? prevRow.timeOfEndOfMovement : routeData.directiveTimeOfEndOfMovement;

    const depthOfConvoy = calculateDepthOfConvoy(
      row.numOfVehicles,
      row.distBetweenVehicles,
    );

    let timeToExtractIntoDestination = 0;
    if (routeData.depthOfFullConvoy > routeData.depthOfDestinationArea && prevRow) {
      // Time to extract into destination from first division end to convoy end

      timeToExtractIntoDestination = (prevRow.depthOfConvoy / prevRow.speedOfExtraction) + prevRow.distToNextConvoy / prevRow.speed;

      // console.log(`${(timeToExtractIntoDestination * 60).toFixed(2)}хв. = (${prevRow.depthOfConvoy} / ${prevRow.speedOfExtraction}) + (${prevRow.distToNextConvoy} / ${prevRow.speed})`);
    }

    // Time when end of convoy enters destination area
    const timeOfEndOfMovement = initialTimeOfEndOfMovement.minus({
      hours: timeToExtractIntoDestination,
    });

    // console.log('New time of end of movement');
    // console.log(timeOfEndOfMovement.toFormat('HH год. mm хв. dd.MM.yyyy'));

    totalTimeToPassRoute =
      (routeData.lengthOfRoute / row.speed) + routeData.stops.reduce((acc, stop) => acc + stop.duration, 0);

    const timeToPassPointOfDeparture_convoyEnd =
      timeOfEndOfMovement.minus({
        hours: totalTimeToPassRoute,
      });

    //
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