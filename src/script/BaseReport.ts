import $ from 'jquery';

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
  MONTH = 'months',
  /**
   * 日
   */
  DAY = 'days'
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
    let dateshow: string = '';
    let format: string = '';
    if (this.type === DATETYPE.YEAR) {
      dateshow = date.getFullYear().toString();
      format = 'yyyy';
    } else if (this.type === DATETYPE.MONTH) {
      const month: number = date.getMonth() + 1;
      dateshow = `${date.getFullYear()}-${month > 9 ? month.toString() : `0${month}`}`;
      format = 'yyyy-mm';
    } else if (this.type === DATETYPE.DAY) {
      const month: number = date.getMonth() + 1;
      const day: number = date.getDay();
      dateshow = `${date.getFullYear()}-${month > 9 ? month.toString() : `0${month}`}-${
        day > 9 ? day : '0' + day
      }`;
      format = 'yyyy-mm-dd';
    }

    this._dateInpJqDom?.val(dateshow).datepicker({
      maxViewMode: 'years',
      minViewMode: this.type,
      startView: this.type,
      format,
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
      this._changeDateHandler = undefined;
    }
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
