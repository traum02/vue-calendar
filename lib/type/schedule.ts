export interface scheduleData {
  seq?: number,
companyCode: string,
schdtFrom: Date,
schdtTo: Date,
timeFrom: string,
timeTo: string,
title: string,
schType: string,
place: string,
contents: string,
alarmYn: string,
refUser: string
repeatYn: string,
category: string,
crtUsrId: string,
crtDt: Date,
updDt: Date,
}

export interface dateSet {
  year: number,
  month: number,
  day: number,
  time?: Array<Object>,
  event?: scheduleData[],
}

export interface restData {
  title: string,
  date: {
      startdt: string,
      starttime: string,
      enddt: string,
      endtime: string,
  },
  place: string,
  contents: string,
  refUser: string,
  seq?: number,
  crtUsrId?: string,
  crtDt?: Date,
}

export interface popupConfig {
  isVisible: boolean,
  isEditable: boolean,    // 수정 권한 여부
  readonly: boolean,      // 수정 여부
  title: string,          // 휴일 이름
  calendarType?: string,  // 휴일, 일정 여부
  isUpdate?: boolean
}

export const EVENT_COLORS = {
  yellow: "rgb(244, 180, 0)",
  blue: "rgb(38, 132, 255)",
  green: "rgb(51, 182, 121)",
  red: "rgb(255, 84, 86)",
  pink: "rgb(239, 139, 239)",
  purple: "rgb(157, 114, 245)",
  turquoise: "rgb(64, 190, 190)",
  brown: "rgb(169, 99, 30)",
};
