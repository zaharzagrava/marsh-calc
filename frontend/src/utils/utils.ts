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
        timeToExtractIntoDestination =
          (routeData.depthOfFullConvoy - routeData.depthOfDestinationArea) /
          row.speedOfExtraction;
      }

      console.log('@timeToExtractIntoDestination');
      console.log(timeToExtractIntoDestination);

      totalTimeToPassRoute =
        (routeData.lengthOfRoute / row.speed) + routeData.totalTimeOfStops;
      const totalTimeToGetToDest = totalTimeToPassRoute + timeToExtractIntoDestination;

      const timeToPassPointOfDeparture_convoyStart =
        routeData.directiveTimeOfEndOfMovement.minus({ hours: totalTimeToGetToDest });
      const timeToPassPointOfDeparture_convoyEnd =
        timeToPassPointOfDeparture_convoyStart.plus({
          hours: depthOfConvoy / row.speed,
        });

      const timeOfStartOfMovement = timeToPassPointOfDeparture_convoyStart.minus({
        hours:
          row.distBetweenConvoyHeadAndInitialPointOfDeparture /
          row.speedOfExtraction,
      });

      // Time when end of convoy enters destination area
      const timeOfEndOfMovement = timeToPassPointOfDeparture_convoyEnd.plus({
        hours: totalTimeToPassRoute,
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

      console.log('@prevRow.timeOfEndOfMovement');
      console.log(row.distToNextConvoy + depthOfConvoy);

      const dist = row.distToNextConvoy + depthOfConvoy;
      sumDist.push(dist);
      sumTime.push(dist / row.speedOfExtraction);

      const timeToAdd = timeToExtractIntoDestination * (r / (rows.length - 1))
      console.log('@timeToAdd');
      console.log(firstRow.timeOfEndOfMovement, timeToAdd);
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

  console.log('@sumDist');
  console.log(sumDist);

  console.log('@sumTime');
  console.log(sumTime.reduce((a, b) => a + b, 0));

  return result;
}