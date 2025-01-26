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
  let timeToExtractIntoDestination = 0;
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    const firstRow = result[0];

    if(r === 0) {
      const depthOfConvoy = calculateDepthOfConvoy(
        row.numOfVehicles,
        row.distBetweenVehicles,
      );

      if (routeData.depthOfFullConvoy > routeData.depthOfDestinationArea) {
        // Time to extract into destination from first division end to convoy end
        timeToExtractIntoDestination =
          (routeData.depthOfFullConvoy - routeData.depthOfDestinationArea - depthOfConvoy) /
          row.speedOfExtraction;
      }

      // Time when end of convoy enters destination area
      const timeOfEndOfMovement = routeData.directiveTimeOfEndOfMovement.minus({
        hours: timeToExtractIntoDestination,
      });

      totalTimeToPassRoute =
        (routeData.lengthOfRoute / row.speed) + routeData.totalTimeOfStops;

      const timeToPassPointOfDeparture_convoyEnd =
        timeOfEndOfMovement.minus({
          hours: totalTimeToPassRoute,
        });

      const timeToPassPointOfDeparture_convoyStart =
      timeToPassPointOfDeparture_convoyEnd.minus({ hours: depthOfConvoy / row.speed });

      const timeOfStartOfMovement = timeToPassPointOfDeparture_convoyStart.minus({
        hours:
          row.distBetweenConvoyHeadAndInitialPointOfDeparture /
          row.speedOfExtraction,
      });

      result.push({
        ...row,
        depthOfConvoy,
        timeToPassPointOfDeparture_convoyStart,
        timeToPassPointOfDeparture_convoyEnd,
        timeOfStartOfMovement,
        timeOfEndOfMovement,
      });
    } else {
      const depthOfConvoy = calculateDepthOfConvoy(
        row.numOfVehicles,
        row.distBetweenVehicles,
      );

      if(!firstRow || totalTimeToPassRoute === 0) throw new Error('Prev row is not defined');

      const dist = row.distToNextConvoy + depthOfConvoy;
      sumDist.push(dist);
      sumTime.push(dist / row.speedOfExtraction);

      const timeToAdd = timeToExtractIntoDestination * (r / (rows.length - 1))
      const timeOfEndOfMovement = firstRow.timeOfEndOfMovement.plus({
        hours: timeToAdd,
      });

      const timeToPassPointOfDeparture_convoyEnd = timeOfEndOfMovement.minus({
        hours: totalTimeToPassRoute,
      });
      const timeToPassPointOfDeparture_convoyStart =
        timeToPassPointOfDeparture_convoyEnd.minus({
          hours: depthOfConvoy / row.speed,
        });
      const timeOfStartOfMovement = timeToPassPointOfDeparture_convoyStart.minus({
        hours:
          row.distBetweenConvoyHeadAndInitialPointOfDeparture /
          row.speedOfExtraction,
      });

      result.push({
        ...row,
        timeOfEndOfMovement,
        timeToPassPointOfDeparture_convoyEnd,
        timeToPassPointOfDeparture_convoyStart,
        timeOfStartOfMovement,
      });
    }
  }

  return result;
}