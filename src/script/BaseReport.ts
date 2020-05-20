import { EChartOption } from 'echarts';
import $ from 'jquery';

/**
 * @description 配置工厂参数
 * @author angle
 * @date 2020-05-19
 * @interface IEChartOptionFactory
 */
export interface IEChartOptionFactory {
  /**
   * @description 标题
   * @type {string}
   * @memberof IEChartOptionFactory
   */
  title: string;
  /**
   * @description x轴数据
   * @type {string[]}
   * @memberof IEChartOptionFactory
   */
  x: string[];
  /**
   * @description 图表类型/默认折线图
   * @type {string}
   * @memberof IEChartOptionFactory
   */
  reportType?: string;
  /**
   * @description 数据值
   * @type {number[]}
   * @memberof IEChartOptionFactory
   */
  y: number[];
}

/**
 * @description 日期类型
 * @export
 * @enum {number}
 */
export enum DATETYPE {
  /**
   * 年
   */
  YEAR = 'years',
  /**
   * 月
   */
  MONTH = 'month'
}

/**
 * @description 报表基类
 * @author angle
 * @date 2020-05-20
 * @abstract
 * @class BaseReport
 * @template DataType 数据类型
 */
abstract class BaseReport<DataType = number> {
  /**
   * @description 输入框jq对象
   * @private
   * @type {(JQuery | null)}
   * @memberof BaseReport
   */
  private readonly _dateInpJqDom: JQuery | null;

  /**
   * @description 日期改变事件
   * @private
   * @memberof BaseReport
   */
  private _changeDateHandler: undefined | ((eventObject: DatepickerEventObject) => void);

  /**
   * @description 类型
   * @protected
   * @type {DATETYPE}
   * @memberof BaseReport
   */
  protected readonly type: DATETYPE;

  /**
   * @description 图表容器对象
   * @protected
   * @type {(HTMLDivElement | null)}
   * @memberof BaseReport
   */
  protected readonly reportDom: HTMLDivElement | null;

  /**
   * @description 初始化组件
   * @author angle
   * @date 2020-05-20
   * @private
   * @memberof BaseReport
   */
  private initComponent(): void {
    const date: Date = new Date();
    this._dateInpJqDom
      ?.val(
        this.type === DATETYPE.YEAR
          ? date.getFullYear()
          : `${date.getFullYear()}-${date.getMonth() + 1}`
      )
      .datepicker({
        maxViewMode: this.type === DATETYPE.YEAR ? 'years' : 'months',
        minViewMode: this.type === DATETYPE.YEAR ? 'years' : 'months',
        startView: this.type === DATETYPE.YEAR ? 'years' : 'months',
        format: this.type === DATETYPE.YEAR ? 'yyyy' : 'yyyy-MM',
        autoclose: true,
        endDate: date
      });
  }

  /**
   *Creates an instance of BaseReport.
   * @author angle
   * @date 2020-05-20
   * @param {string} dateInpId 日期输入框id
   * @param {string} reportId 图表容器id
   * @param {DATETYPE} type 类型
   * @memberof BaseReport
   */
  constructor(dateInpId: string, reportId: string, type: DATETYPE) {
    this.type = type;
    this._dateInpJqDom = $(`#${dateInpId}`);
    const reportDom = document.getElementById(reportId);
    this.reportDom = reportDom && reportDom instanceof HTMLDivElement ? reportDom : null;
    this.initComponent();
  }

  /**
   * @description 事件监听
   * @author angle
   * @date 2020-05-20
   * @param {'changeDate'} events 事件名 日期改变
   * @param {(eventObject: DatepickerEventObject) => void} handler 处理函数
   * @memberof BaseReport
   * @example
   *  report.addEventListener('changeDate', date => console.log(date))
   */
  public addEventListener(
    events: 'changeDate',
    handler: (eventObject: DatepickerEventObject) => void
  ): void {
    if (events === 'changeDate') {
      this.removeEventListener('changeDate');
      this._changeDateHandler = handler;
      this._dateInpJqDom?.on('changeDate', this._changeDateHandler);
    }
  }

  /**
   * @description 移出事件事件监听
   * @author angle
   * @date 2020-05-20
   * @param {'changeDate'} events 事件名 日期改变
   * @param {(eventObject: DatepickerEventObject) => void} [handler] handler 处理函数
   * @memberof BaseReport
   * @example
   *  report.addEventListener('changeDate')
   */
  public removeEventListener(
    events: 'changeDate',
    handler?: (eventObject: DatepickerEventObject) => void
  ): void {
    const fn: ((eventObject: DatepickerEventObject) => void) | undefined =
      handler ?? this._changeDateHandler;
    if (events === 'changeDate' && fn) {
      this._dateInpJqDom?.off('changeDate', fn);
    }
  }

  /**
   * @description 配置工厂
   * @author angle
   * @date 2020-05-20
   * @protected
   * @param {IEChartOptionFactory} option 配置项
   * @returns {EChartOption} 生成配置
   * @memberof BaseReport
   * @example
   *   this.eChartOptionFactory(arg)
   */
  protected eChartOptionFactory(option: IEChartOptionFactory): EChartOption {
    return {
      ...option,
      title: {
        text: option.title,
        textStyle: {
          color: '#fff'
        }
      },
      xAxis: {
        data: option.x,
        boundaryGap: false,
        axisPointer: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        },
        axisLabel: {
          color: '#fff'
        }
      },
      yAxis: {
        axisLabel: {
          color: '#fff'
        }
      },
      dataZoom: [
        {
          type: 'slider',
          realtime: true,
          start: 0,
          end: 50,
          zoomLock: true
        }
      ],
      tooltip: {
        show: true,
        axisPointer: {
          show: true
        }
      },
      series: [
        {
          type: option.reportType ?? 'line',
          data: option.y
        }
      ]
    };
  }

  /**
   * @description 数据渲染
   * @author angle
   * @date 2020-05-20
   * @abstract
   * @param {DataType[]} data 数据源
   * @param {Date} date 日期
   * @memberof BaseReport
   * @example
   *  report.renderData([], new Date())
   */
  public abstract renderData(data: DataType[], date: Date): void;
}

export default BaseReport;
