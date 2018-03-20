const formatData = date => {
  // transform 2018-01-21 06:00:00.000 to {year: 2018, month: 'January', day: 21}
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  if (date) {
    const jdate = date.split('T')[0].split('-');
    return {
      year: Number(jdate[0]),
      month: months[Number(jdate[1]) - 1],
      day: Number(jdate[2])
    };
  }
  return {
    year: '',
    month: '',
    day: ''
  };
};

const formatOnlineTimeSpent = (time, type) => {
  if (time <= 0) {
    return 0;
  }
  if (type === 'warrior') {
    return Math.ceil(time / 20);
  } else if (type === 'korea') {
    return Math.ceil(time / 45);
  }
};

const formatRank = rank => {
  const index = Number(rank) - 1;
  const data = {
    rankName: ['学神', '骨灰级学霸', '休闲学者', '不明觉厉'],
    rankDesc: [
      '你已经这么优秀了，竟然还这么努<br />力，宇宙已经无法阻挡你！',
      '闻鸡起舞是你，挑灯夜战是你，<br />最终一飞冲天的也会是你！',
      '怕什么知识无穷，<br />进一寸有一寸的惊喜！',
      '感觉毫不费力就很厉害的样子，<br />膜拜！'
    ],
    rankLevel: [0, 1, 2, 3]
  };
  return {
    rankName: data.rankName[index],
    rankDesc: data.rankDesc[index],
    rankLevel: data.rankLevel[index]
  };
};

const getReportFromSessionStorage = () => {
  const report = window.sessionStorage.getItem('ec-report');
  if (report) {
    return JSON.parse(report);
  }
  return undefined;
};

const getReport = async () => {
  //   return ajax({
  //     url: '/ecplatform/api/annualreport/get',
  //     transformResponse: [
  //       resData => {
  //         // Do whatever you want to transform the data
  //         const response = JSON.parse(resData);
  //         let rdata;
  //         if (response.IsSuccess) {
  //           const data = response.Report;
  //           const startDate = formatData(data.CurrentProductStartDate);
  //           const fisrtSmartDate = formatData(data.FirstSSDate);
  //           const firstOnlineDate = formatData(data.FirstOnlineDate);
  //           const firstOfflineDate = formatData(data.FirstOfflineDate);
  //           rdata = {
  //             status: true,
  //             expired: false,
  //             page1: {
  //               next: 2
  //             },
  //             page2: {
  //               year: startDate.year,
  //               month: startDate.month,
  //               day: startDate.day,
  //               countDay: data.StudyDuration,
  //               next: 3,
  //               prev: 1
  //             },
  //             page3: {
  //               year: fisrtSmartDate.year,
  //               month: fisrtSmartDate.month,
  //               day: fisrtSmartDate.day,
  //               next: firstOnlineDate.year ? 4 : firstOfflineDate.year ? 6 : 8,
  //               prev: 2
  //             },
  //             page4: {
  //               year: firstOnlineDate.year,
  //               month: firstOnlineDate.month,
  //               day: firstOnlineDate.day,
  //               teacher: data.FirstOnlineTeacher,
  //               next: 5,
  //               prev: 3
  //             },
  //             page5: {
  //               countPL: data.PLCount,
  //               countGL: data.GLCount,
  //               totalTime: data.OverallOnlineTime,
  //               countWarrior: formatOnlineTimeSpent(data.OverallOnlineTime, 'warrior'),
  //               countKorea: formatOnlineTimeSpent(data.OverallOnlineTime, 'korea'),
  //               next: firstOfflineDate.year ? 6 : 8,
  //               prev: 4
  //             },
  //             page6: {
  //               year: firstOfflineDate.year,
  //               month: firstOfflineDate.month,
  //               day: firstOfflineDate.day,
  //               center: data.FirstOfflineCenter,
  //               course: data.FirstOfflineClass,
  //               topic: data.FirstOfflineTopic,
  //               next: 7,
  //               prev: firstOnlineDate.year ? 5 : 3
  //             },
  //             page7: {
  //               countOffline: data.OverallOfflineCount,
  //               timeSpent: data.OverallOfflineTime,
  //               course: data.MostFavoriteOfflineClass,
  //               next: 8,
  //               prev: 6
  //             },
  //             page8: {
  //               countUnits: data.UnitCount,
  //               countLessons: data.LessonsCount,
  //               next: 9,
  //               prev: firstOfflineDate.year ? 7 : firstOnlineDate.year ? 5 : 3
  //             },
  //             page9: {
  //               next: 10,
  //               prev: 8
  //             },
  //             page10: {
  //               next: 11,
  //               prev: 9
  //             },
  //             page11: Object.assign(formatRank(data.Rank), {
  //               next: 12,
  //               prev: 10
  //             }),
  //             page12: {
  //               prev: 11
  //             }
  //           };
  //           window.sessionStorage.setItem('ec-report', JSON.stringify(rdata));
  //         } else {
  //           rdata = {
  //             status: false
  //           };
  //           if (response.ErrorCode && response.ErrorCode.toLowerCase() === 'expired') {
  //             rdata.expired = true;
  //           }
  //         }
  //         return rdata;
  //       }
  //     ]
  //   });
};

export default getReport;
export { getReportFromSessionStorage };
