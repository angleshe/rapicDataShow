import '../icon/iconfont.css';
import 'bootstrap/scss/bootstrap.scss';
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css';
import '../reset.scss';
import '../index.scss';
import 'bootstrap';
import 'bootstrap-datepicker';
import $ from 'jquery';
import LineReport from './LineReport';
import { DATETYPE } from './BaseReport';
import BlockBar, { IAchievement } from './BlockBar';
import MapReport from './MapReport';
import MalaysiaMapData from './Malaysia.json';

interface IMapData {
  name: string;
  orderNumber: number;
  couponTotal: number;
  subsidyTotal: number;
  sendPrice: number;
}

/**
 * @description 生成随机数
 * @author angle
 * @date 2020-05-19
 * @param {number} min 最小边界值
 * @param {number} [max] 最大边界值
 * @returns {number} 随机数
 * @example
 *  randomNum(99, 99999)
 */
function randomNum(min: number, max?: number): number {
  if (max === undefined) {
    return Math.floor(Math.random() * min + 1);
  }
  return Math.floor(Math.random() * (max - min + 1) + min);
}
/**
 * @description 获取某个月的总天数
 * @author angle
 * @date 2020-05-20
 * @param {number} year 年
 * @param {number} month 月
 * @returns {number} 天数
 */
function getDaysOfMonth(year: number, month: number): number {
  const date: Date = new Date(year, month, 0);
  return date.getDate();
}

/**
 * @description 获取月份数
 * @author angle
 * @date 2020-05-20
 * @param {number} year 年份
 * @returns {number}
 */
function getMonthsOfYear(year: number): number {
  const date: Date = new Date();
  const nowYear: number = date.getFullYear();
  if (year < nowYear) {
    return 12;
  }
  if (year === nowYear) {
    return date.getMonth() + 1;
  }
  return 0;
}

/**
 * @description 测试数据生产工厂
 * @author angle
 * @date 2020-05-20
 * @param {Date} [date=new Date()] 日期
 * @param {DATETYPE} [type=DATETYPE.YEAR] 类型
 * @returns {number[]}
 */
function testDataFactory(date: Date = new Date(), type: DATETYPE = DATETYPE.YEAR): number[] {
  return Array.from<undefined, number>(
    Array<undefined>(
      type === DATETYPE.YEAR
        ? getMonthsOfYear(date.getFullYear())
        : getDaysOfMonth(date.getFullYear(), date.getMonth())
    ),
    () => randomNum(99, 999)
  );
}

/**
 * @description 业绩测试数据生产工厂
 * @author angle
 * @date 2020-05-20
 * @returns {IAchievement[]}
 */
function testAchievemenDataFactory(): IAchievement[] {
  return Array.from<undefined, IAchievement>(Array<undefined>(24), () => ({
    orderNumber: randomNum(99, 999),
    platformDiscount: randomNum(99, 999),
    sendDistance: randomNum(99, 999),
    sendPrice: randomNum(99, 999),
    shopDiscount: randomNum(99, 999),
    subsidy: randomNum(99, 999)
  }));
}

/**
 * @description 地图测试数据生产工厂
 * @author angle
 * @date 2020-05-21
 * @returns {IMapData[]}
 */
function testMapDataFactory(): IMapData[] {
  return MalaysiaMapData.features.map<IMapData>((item) => ({
    name: item.properties.name ?? '',
    couponTotal: randomNum(99, 999),
    orderNumber: randomNum(99, 999),
    sendPrice: randomNum(99, 999),
    subsidyTotal: randomNum(99, 999)
  }));
}

$(() => {
  const date: Date = new Date();
  const yearOrder: LineReport = new LineReport('year-order-inp', 'year-order-report', {
    title: '年度订单分布图',
    initData: testDataFactory()
  });
  yearOrder.addEventListener('changeDate', (ev) => {
    yearOrder.renderData(testDataFactory(ev.date));
  });

  const monthOrder: LineReport = new LineReport('month-order-inp', 'month-order-report', {
    title: '每月订单分布图',
    initData: testDataFactory(date, DATETYPE.MONTH),
    type: DATETYPE.MONTH
  });
  monthOrder.addEventListener('changeDate', (ev) => {
    monthOrder.renderData(testDataFactory(ev.date, DATETYPE.MONTH));
  });

  const yearSubsidy: LineReport = new LineReport('year-subsidy-inp', 'year-subsidy-report', {
    title: '年度补贴总额统计',
    initData: testDataFactory()
  });
  yearSubsidy.addEventListener('changeDate', (ev) => {
    yearSubsidy.renderData(testDataFactory(ev.date));
  });

  const monthSubsidy: LineReport = new LineReport('month-subsidy-inp', 'month-subsidy-report', {
    title: '每月补贴总额统计',
    initData: testDataFactory(date, DATETYPE.MONTH),
    type: DATETYPE.MONTH
  });
  monthSubsidy.addEventListener('changeDate', (ev) => {
    monthSubsidy.renderData(testDataFactory(ev.date, DATETYPE.MONTH));
  });

  const yearCoupon: LineReport = new LineReport('year-coupon-inp', 'year-coupon-report', {
    title: '年度优惠总额统计',
    initData: testDataFactory()
  });
  yearCoupon.addEventListener('changeDate', (ev) => {
    yearCoupon.renderData(testDataFactory(ev.date));
  });

  const monthCoupon: LineReport = new LineReport('month-coupon-inp', 'month-coupon-report', {
    title: '每月优惠总额统计',
    initData: testDataFactory(date, DATETYPE.MONTH),
    type: DATETYPE.MONTH
  });
  monthCoupon.addEventListener('changeDate', () => {
    monthCoupon.renderData(testDataFactory(date, DATETYPE.MONTH));
  });

  const yearSend: LineReport = new LineReport('year-send-inp', 'year-send-report', {
    title: '年度寄送费总额统计',
    initData: testDataFactory()
  });
  yearSend.addEventListener('changeDate', (ev) => {
    yearSend.renderData(testDataFactory(ev.date));
  });

  const monthSend: LineReport = new LineReport('month-send-inp', 'month-send-report', {
    title: '每月寄送费总额统计',
    initData: testDataFactory(date, DATETYPE.MONTH),
    type: DATETYPE.MONTH
  });
  monthSend.addEventListener('changeDate', (ev) => {
    monthSend.renderData(testDataFactory(ev.date, DATETYPE.MONTH));
  });

  const achievemen: BlockBar = new BlockBar(
    'achievement-inp',
    'achievement-report',
    testAchievemenDataFactory()
  );
  achievemen.addEventListener('changeDate', () => {
    achievemen.renderData(testAchievemenDataFactory());
  });

  const mapDataDom: {
    orderNumber: HTMLDivElement | null;
    couponTotal: HTMLDivElement | null;
    subsidyTotal: HTMLDivElement | null;
    sendPrice: HTMLDivElement | null;
  } = {
    couponTotal: document.querySelector<HTMLDivElement>('.order-count'),
    orderNumber: document.querySelector<HTMLDivElement>('.coupon-count'),
    sendPrice: document.querySelector<HTMLDivElement>('.subsidy'),
    subsidyTotal: document.querySelector<HTMLDivElement>('.send-price')
  };

  function setMapDataShow(data: IMapData) {
    if (mapDataDom.couponTotal) {
      mapDataDom.couponTotal.innerText = data.couponTotal.toString();
    }
    if (mapDataDom.orderNumber) {
      mapDataDom.orderNumber.innerText = data.orderNumber.toString();
    }
    if (mapDataDom.sendPrice) {
      mapDataDom.sendPrice.innerText = data.sendPrice.toString();
    }
    if (mapDataDom.subsidyTotal) {
      mapDataDom.subsidyTotal.innerText = data.subsidyTotal.toString();
    }
  }

  const mapTestData: IMapData[] = testMapDataFactory();
  const totalMapData: IMapData = mapTestData.reduce<IMapData>(
    (prev, curr) => ({
      couponTotal: prev.couponTotal + curr.couponTotal,
      orderNumber: prev.orderNumber + curr.orderNumber,
      sendPrice: prev.sendPrice + curr.sendPrice,
      subsidyTotal: prev.subsidyTotal + curr.subsidyTotal,
      name: '全国'
    }),
    {
      couponTotal: 0,
      orderNumber: 0,
      sendPrice: 0,
      subsidyTotal: 0,
      name: ''
    }
  );

  const positionBtn: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>(
    '.position-btn'
  );

  positionBtn?.addEventListener('click', () => {
    setMapDataShow(totalMapData);
  });
  const mapReport: MapReport = new MapReport<IMapData & { value: number }>(
    'map',
    mapTestData.map<IMapData & { value: number }>((item) => ({
      ...item,
      value: item.orderNumber
    }))
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapReport.addEventListener('click', (e: any) => {
    setMapDataShow(e.data);
  });

  setMapDataShow(totalMapData);
});
