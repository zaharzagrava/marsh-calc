import { RouteData, RowData } from "../types/types";

export const calculateDepthOfConvoy = (
  numOfVehicles: number,
  distBetweenVehicles: number,
  distToNextConvoy: number
): number => {
  return (numOfVehicles * distBetweenVehicles + distToNextConvoy) / 1000;
};

export const calculateExtraColumns = (row: RowData, routeData: RouteData): RowData => {
  const depthOfConvoy = calculateDepthOfConvoy(
    row.numOfVehicles,
    row.distBetweenVehicles,
    row.distToNextConvoy
  );

  let timeToExtractIntoDestination = 0;
  if (routeData.depthOfFullConvoy > routeData.depthOfDestinationArea) {
    timeToExtractIntoDestination =
      (routeData.depthOfFullConvoy - routeData.depthOfDestinationArea) /
      row.speedOfExtraction;
  }

  const totalTimeToPassRoute =
    routeData.lengthOfRoute / row.speed + routeData.totalTimeOfStops;
  const totalTimeToPass = totalTimeToPassRoute + timeToExtractIntoDestination;

  const timeToPassPointOfDeparture_convoyStart =
    routeData.directiveTimeOfEndOfMovement.minus({ hours: totalTimeToPass });
  const timeOfStartOfMovement = timeToPassPointOfDeparture_convoyStart.minus({
    hours:
      row.distBetweenConvoyHeadAndInitialPointOfDeparture /
      row.speedOfExtraction,
  });
  const timeToPassPointOfDeparture_convoyEnd =
    timeToPassPointOfDeparture_convoyStart.plus({
      hours: depthOfConvoy / row.speedOfExtraction,
    }); // TODO: check if this is correct

  const timeOfEndOfMovement = timeToPassPointOfDeparture_convoyEnd.plus({
    hours: totalTimeToPassRoute,
  });

  return {
    ...row,
    depthOfConvoy,
    timeToPassPointOfDeparture_convoyStart,
    timeToPassPointOfDeparture_convoyEnd,
    timeOfStartOfMovement,
    timeOfEndOfMovement,
  };
};