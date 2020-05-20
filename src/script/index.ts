import '../icon/iconfont.css';
import '../reset.scss';
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css';
import '../index.scss';
import 'bootstrap';
import 'bootstrap-datepicker';
import $ from 'jquery';
import LineReport from './LineReport';
import { DATETYPE } from './BaseReport';

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
});
