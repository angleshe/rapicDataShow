import Echart, { ECharts, EChartOption } from 'echarts';
import BaseReport, { DATETYPE } from './BaseReport';
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
   * @description 数据值
   * @type {number[]}
   * @memberof IEChartOptionFactory
   */
  y: number[];
  /**
   * @description 折线颜色
   * @type {string}
   * @memberof IEChartOptionFactory
   */
  lineColor?: string;
}

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
   * @description 折线颜色
   * @type {string}
   * @memberof ILineReportOption
   */
  lineColor?: string;

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
   * @description 折线颜色
   * @private
   * @type {(string | undefined)}
   * @memberof LineReport
   */
  private readonly _lineColor: string | undefined;

  /**
   * @description 图表处理对象
   * @private
   * @type {(ECharts | null)}
   * @memberof LineReport
   */
  private _echarts: ECharts | null = null;

  /**
   * @description 初始化
   * @author angle
   * @date 2020-05-20
   * @private
   * @memberof LineReport
   */
  private init(): void {
    if (this.reportDom) {
      this._echarts = Echart.init(this.reportDom);
      this.renderData(this._initData);
    }
  }

  /**
   * @description 配置工厂
   * @author angle
   * @date 2020-05-20
   * @private
   * @param {IEChartOptionFactory} option 配置项
   * @returns {EChartOption} 生成配置
   * @memberof LineReport
   */
  private _eChartOptionFactory(option: IEChartOptionFactory): EChartOption {
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
        boundaryGap: this.type === DATETYPE.YEAR,
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
          end: this.type === DATETYPE.YEAR ? undefined : 50,
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
          type: this.type === DATETYPE.YEAR ? 'bar' : 'line',
          barWidth: this.type === DATETYPE.YEAR ? 20 : undefined,
          data: option.y,
          lineStyle: {
            color: option.lineColor
          },
          itemStyle: {
            color: option.lineColor,
            borderColor: option.lineColor
          }
        }
      ]
    };
  }

  /**
   *Creates an instance of LineReport.
   * @author angle
   * @date 2020-05-20
   * @param {string} dateInpId 日期输入框id
   * @param {string} reportId 图表容器id
   * @param {ILineReportOption} { type, initData, title } 配置项
   * @memberof LineReport
   */
  constructor(
    dateInpId: string,
    reportId: string,
    { type, initData, title, lineColor }: ILineReportOption
  ) {
    super(dateInpId, reportId, type ?? DATETYPE.YEAR);
    this._initData = initData ?? [];
    this._title = title;
    this._lineColor = lineColor;
    this.init();
  }

  public renderData(data: number[]): void {
    if (this._echarts) {
      this._echarts.setOption(
        this._eChartOptionFactory({
          title: this._title,
          lineColor: this._lineColor,
          x: (this.type === DATETYPE.YEAR ? this._monthLabel : this._dayLabel).slice(
            0,
            data.length
          ),
          y: data
        })
      );
    }
  }
}

export default LineReport;
