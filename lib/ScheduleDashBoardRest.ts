// import { useRest } from "@ubuilder/auth";
// const baseUrl = "/schedule/dashboard";

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


export function convertDatetoString(dt: Date|string) {
    const date = typeof dt === 'string'? new Date(dt): dt;

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return [year, month.toString().padStart(2, "0"), day.toString().padStart(2, "0")].join("-");
}

export function diffMonth(dateTo: Date, dateFrom: Date) {
    return dateTo.getMonth() - dateFrom.getMonth() + (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))+1;
}

export function formatDate(dt: string, dtTime: string | null) {
    const date = new Date(dt);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    // const hh = date.getHours();
    // const mm = date.getMinutes();

    const strDate = [year, month.toString().padStart(2, "0"), day.toString().padStart(2, "0")].join("-");
    const strTime = dtTime??"";

    return strDate+(dtTime!=null?" "+strTime:"");
}

// export async function getSearch(frDt: Date, toDt: Date) {
//     const url = `${baseUrl}`;
//     const date1 = convertDatetoString(frDt);
//     const date2 = convertDatetoString(toDt);
//     try {
//         let raw: scheduleData[] = await useRest().get(url, {frDt: date1, toDt: date2});
//         return raw

//     } catch (e: any) {
//         console.log(e);
//     }
// }

export async function createData(e: restData) {
    if(!e) throw new Error('Error data.');
    // const url = `${baseUrl}`;
    // const param = {
    //     schdtFrom: e.date.startdt,
    //     schdtTo: e.date.enddt,
    //     timeFrom: e.date.starttime,
    //     timeTo: e.date.endtime,
    //     title: e.title,
    //     place: e.place,
    //     contents: e.contents,
    //     refUser: e.refUser,
    // };


    try {
        // await useRest().post(url, param);
    } catch (e: any) {
        console.log(e);
    } finally {

    }
}

export async function modifyData(e: restData) {
    if(!e) throw new Error('Error data.');
    // const url = `${baseUrl}`;
    // const param = {
    //     seq: e.seq,
    //     schdtFrom: e.date.startdt,
    //     schdtTo: e.date.enddt,
    //     timeFrom: e.date.starttime,
    //     timeTo: e.date.endtime,
    //     title: e.title,
    //     place: e.place,
    //     contents: e.contents,
    //     refUser: e.refUser,
    //     crtUsrId: e.crtUsrId,
    //     crtDt: e.crtDt
    // };


    // try {
    //     // await useRest().put(url, param);
    // } catch (e: any) {
    //     console.log(e);
    // } finally {

    // }
}

export async function deleteData(seq: number) {
    if(!seq) throw new Error('Error seq.');
    // const url = `${baseUrl}/${seq}`;
    try {
        // await useRest().delete(url);
    } catch (e: any) {
        console.log(e);
    } finally {
        
    }
}
