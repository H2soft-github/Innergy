export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
) => {
  let result : ServiceType[];
  switch (action.type) {
    case "Select":
      result = SelectServiceWithLogic(previouslySelectedServices, action.service);
      break;
    case "Deselect":
      result = DeselectServiceWithLogic(previouslySelectedServices, action.service);
      break;
  }
  return result;
};

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) =>
{
  let basePrice = CalcBasePrice(selectedServices, selectedYear);
  let discount = CalcDiscount(selectedServices, selectedYear);
   return ({
      basePrice: basePrice,
      finalPrice: basePrice - discount
   });
};

const SelectServiceIfNotSelected = (service: ServiceType, previouslySelectedServices: ServiceType[]): ServiceType[] => {
  let result: ServiceType[] = previouslySelectedServices;
  if (!result.some(x => x === service)) {
    result.push(service);
  }
  return result;
};

const SelectServiceWithLogic = (previouslySelectedServices: ServiceType[], service: ServiceType): ServiceType[] => {
  let result: ServiceType[];
  switch (service) {
    case "Photography":
      result = SelectServiceIfNotSelected(service, previouslySelectedServices);
      break;
    case "VideoRecording":
      result = SelectServiceIfNotSelected(service, previouslySelectedServices);
      break;
    case "BlurayPackage":
      if (previouslySelectedServices.some(x => x == "VideoRecording")) {
        result = SelectServiceIfNotSelected(service, previouslySelectedServices);
      } else {
        result = previouslySelectedServices;
      }
      break;
    case "TwoDayEvent":
      if (previouslySelectedServices.some(x => x == "VideoRecording")
          || previouslySelectedServices.some(x => x == "Photography")) {
        result = SelectServiceIfNotSelected(service, previouslySelectedServices);
      } else {
        result = previouslySelectedServices;
      }
  }
  return result;
}

const DeselectServiceIfSelected = (service: ServiceType, previouslySelectedServices: ServiceType[]): ServiceType[] => {
  return previouslySelectedServices.filter(x => x !== service);
};

const DeselectServiceWithLogic = (previouslySelectedServices: ServiceType[], service: ServiceType): ServiceType[] => {
  let result: ServiceType[] = previouslySelectedServices;
  if (service === "VideoRecording") {
    result = DeselectServiceIfSelected("BlurayPackage", result);
    if (!previouslySelectedServices.some(x => x === "Photography"))
    {
      result = DeselectServiceIfSelected("TwoDayEvent", result);
    }
  }
  else if (service === "Photography") {
    if (!previouslySelectedServices.some(x => x === "VideoRecording"))
    {
      result = DeselectServiceIfSelected("TwoDayEvent", result);
    }
  }
  result = DeselectServiceIfSelected(service, result);
  return result;
}

const CalcBasePrice = (selectedServices: ServiceType[], selectedYear: number) => {
  const photoCost = [1700, 1800, 1900];
  const videoRecCost = [1700, 1800, 1900];
  const photoVideoCost = [2200, 2300, 2500];
  let basePrice = 0;
  if (selectedServices.some(x => x === "Photography") && selectedServices.some(x => x === "VideoRecording")) {
    basePrice += photoVideoCost[selectedYear - 2020];
  } else {
    if (selectedServices.some(x => x === "Photography")) {
      basePrice += photoCost[selectedYear - 2020];
    }
    if (selectedServices.some(x => x === "VideoRecording")) {
      basePrice += videoRecCost[selectedYear - 2020];
    }
  }
  if (selectedServices.some(x => x === "BlurayPackage")) {
    basePrice += 300;
  }
  if (selectedServices.some(x => x === "TwoDayEvent")) {
    basePrice += 400;
  }
  if (selectedServices.some(x => x === "WeddingSession")) {
    basePrice += 600;
  }
  return basePrice;
}

const CalcDiscount = (selectedServices: ServiceType[], selectedYear: number) => {
  let discount = 0;
  if (selectedServices.some(x => x === "WeddingSession")) {
    if (selectedYear === 2022 && selectedServices.some(x => x === "Photography")) {
      discount = 600;
    } else if (selectedYear === 2022 && selectedServices.some(x => x === "VideoRecording")) {
      discount = 300;
    } else if (selectedYear !== 2022
               && (selectedServices.some(x => x === "Photography")
                   || selectedServices.some(x => x === "VideoRecording"))) {
      discount = 300;
    }
  }
  return discount;
}
