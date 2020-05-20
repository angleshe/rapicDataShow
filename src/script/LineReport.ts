import Echart, { ECharts } from 'echarts';
import BaseReport, { DATETYPE } from './BaseReport';

/**
 * @description 折线图
 * @author angle
 * @date 2020-05-20
 * @export
 * @interface ILineReportOption
 */
export interface ILineReportOption {
  /**
   * @description 图表类型
   * @type {DATETYPE}
   * @memberof ILineReportOption
   */
  type?: DATETYPE;

  /**
   * @description 标题
   * @type {string}
   * @memberof ILineReportOption
   */
  title: string;

  /**
   * @description 初始数据
   * @type {number[]}
   * @memberof ILineReportOption
   */
  initData?: number[];
}

/**
 * @description 折线图
 * @author angle
 * @date 2020-05-20
 * @class LineReport
 * @extends {BaseReport}
 */
class LineReport extends BaseReport {
  /**
   * @description 月份标签
   * @private
   * @type {string[]}
   * @memberof LineReport
   */
  private readonly _monthLabel: string[] = [
    'Jan.',
    'Feb.',
    'Mar.',
    'Apr.',
    'May.',
    'Jun.',
    'jul.',
    'Aug.',
    'Sept.',
    'Oct.',
    'Nov.',
    'Dec.'
  ];

  /**
   * @description 日标签
   * @private
   * @type {string[]}
   * @memberof LineReport
   */
  private readonly _dayLabel: string[] = Array.from<undefined, string>(
    Array<undefined>(31),
    (_: undefined, key: number): string => (key + 1 > 9 ? (key + 1).toString() : `0${key + 1}`)
  );

  /**
   * @description 初始数据
   * @private
   * @type {number[]}
   * @memberof LineReport
   */
  private readonly _initData: number[];

  /**
   * @description 标题
   * @private
   * @type {string}
   * @memberof LineReport
   */
  private readonly _title: string;

  /**
   * @description 图表处理对象
   * @private
   * @type {(ECharts | null)}
   * @memberof LineReport
   */
  private echarts: ECharts | null = null;

  /**
   *Creates an instance of LineReport.
   * @author angle
   * @date 2020-05-20
   * @param {string} dateInpId 日期输入框id
   * @param {string} reportId 图表容器id
   * @param {ILineReportOption} { type, initData, title } 配置项
   * @memberof LineReport
   */
  constructor(dateInpId: string, reportId: string, { type, initData, title }: ILineReportOption) {
    super(dateInpId, reportId, type ?? DATETYPE.YEAR);
    this._initData = initData ?? [];
    this._title = title;
    this.init();
  }

  public renderData(data: number[]): void {
    if (this.echarts) {
      this.echarts.setOption(
        this.eChartOptionFactory({
          title: this._title,
          x: (this.type === DATETYPE.YEAR ? this._monthLabel : this._dayLabel).slice(
            0,
            data.length
          ),
          y: data
        })
      );
    }
  }

  /**
   * @description 初始化
   * @author angle
   * @date 2020-05-20
   * @private
   * @memberof LineReport
   */
  private init(): void {
    if (this.reportDom) {
      this.echarts = Echart.init(this.reportDom);
      this.renderData(this._initData);
    }
  }
}

export default LineReport;
