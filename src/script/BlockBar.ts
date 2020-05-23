import BaseReport, { DATETYPE } from './BaseReport';
import Echart, { ECharts } from 'echarts';

/**
 * @description 业绩数据结构
 * @author angle
 * @date 2020-05-20
 * @export
 * @interface IAchievement
 */
export interface IAchievement {
  /**
   * @description 订单数量
   * @type {number}
   * @memberof IAchievement
   */
  orderNumber: number;
  /**
   * @description 平台优惠
   * @type {number}
   * @memberof IAchievement
   */
  platformDiscount: number;
  /**
   * @description 商家优惠
   * @type {number}
   * @memberof IAchievement
   */
  shopDiscount: number;
  /**
   * @description 补贴总额
   * @type {number}
   * @memberof IAchievement
   */
  subsidy: number;
  /**
   * @description 接送费总额
   * @type {number}
   * @memberof IAchievement
   */
  sendPrice: number;
  /**
   * @description 接送距离
   * @type {number}
   * @memberof IAchievement
   */
  sendDistance: number;
}

class BlockBar extends BaseReport<IAchievement> {
  private readonly _timeLabel: string[] = Array.from<undefined, string>(
    Array<undefined>(24),
    (_: undefined, index: number): string => `${index < 10 ? '0' + index : index}:00`
  ).reverse();
  /**
   * @description 柱状图dom
   * @private
   * @type {(HTMLDivElement | null)}
   * @memberof BlockBar
   */
  private _reportBarDom: HTMLDivElement | null = null;

  /**
   * @description 数据dom
   * @private
   * @type {(HTMLDivElement | null)}
   * @memberof BlockBar
   */
  private _dataDom: HTMLDivElement | null = null;

  /**
   * @description 表格脚步dom
   * @private
   * @type {(HTMLUListElement | null)}
   * @memberof BlockBar
   */
  private _footerDom: HTMLUListElement | null = null;

  /**
   * @description 图表处理对象
   * @private
   * @type {(ECharts | null)}
   * @memberof BlockBar
   */
  private _echarts: ECharts | null = null;

  /**
   * @description 初始化
   * @author angle
   * @date 2020-05-20
   * @private
   * @param {IAchievement[]} initData 初始化数据
   * @memberof BlockBar
   */
  private init(initData: IAchievement[]): void {
    this._reportBarDom = this.reportDom?.querySelector<HTMLDivElement>('#table-report') ?? null;
    this._dataDom = this.reportDom?.querySelector<HTMLDivElement>('#table-data') ?? null;
    this._footerDom = this.reportDom?.querySelector<HTMLUListElement>('.table-footer') ?? null;
    if (this._reportBarDom) {
      this._echarts = Echart.init(this._reportBarDom);
      this.renderData(initData);
    }
  }
  /**
   * @description 渲染柱状图
   * @author angle
   * @date 2020-05-21
   * @private
   * @param {number[]} data
   * @memberof BlockBar
   */
  private _renderBar(data: number[]): void {
    this._echarts?.setOption({
      xAxis: [
        {
          show: false
        }
      ],
      yAxis: [
        {
          type: 'category',
          data: this._timeLabel,
          axisLabel: {
            color: '#fff',
            padding: [0, 5],
            height: 25,
            lineHeight: 25,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            borderRadius: [13, 0, 0, 13] as any,
            backgroundColor: '#214c46',
            margin: 0
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          axisTick: {
            show: false
          },
          boundaryGap: false
        }
      ],
      series: [
        {
          type: 'bar',
          data: data.reverse(),
          barWidth: 25,
          itemStyle: {
            color: new Echart.graphic.LinearGradient(0, 0, 1, 1, [
              { offset: 0, color: '#2e2c7f' },
              { offset: 1, color: '#7897d4' }
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ]) as any
          }
        }
      ],
      grid: {
        left: 45,
        top: 22,
        bottom: 16
      }
    });
  }
  /**
   * @description 生成数据表格
   * @author angle
   * @date 2020-05-21
   * @private
   * @param {IAchievement[]} data 数据源
   * @returns {({
   *     html: string;
   *   } & IAchievement)} 数据表格对象
   * @memberof BlockBar
   */
  private _emitTableObj(
    data: IAchievement[]
  ): {
    html: string;
  } & IAchievement {
    return data.reduce<{ html: string } & IAchievement>(
      (prev, curr) => ({
        html:
          prev.html +
          `<ul class="table-data">` +
          `<li class="box">${curr.orderNumber}</li>` +
          `<li class="box">${curr.platformDiscount}</li>` +
          `<li class="box">${curr.shopDiscount}</li>` +
          `<li class="box">${curr.subsidy}</li>` +
          `<li class="box">${curr.sendPrice}</li>` +
          `<li class="box">${curr.shopDiscount}</li>` +
          `</ul>`,
        orderNumber: prev.orderNumber + curr.orderNumber,
        platformDiscount: prev.platformDiscount + curr.platformDiscount,
        sendDistance: prev.sendDistance + curr.sendDistance,
        sendPrice: prev.sendPrice + curr.sendPrice,
        shopDiscount: prev.shopDiscount + curr.shopDiscount,
        subsidy: prev.subsidy + curr.subsidy
      }),
      {
        html: '',
        orderNumber: 0,
        platformDiscount: 0,
        sendDistance: 0,
        sendPrice: 0,
        shopDiscount: 0,
        subsidy: 0
      }
    );
  }

  /**
   * @description 渲染表格体
   * @author angle
   * @date 2020-05-21
   * @private
   * @param {string} html 表格html
   * @memberof BlockBar
   */
  private _renderTableBody(html: string): void {
    if (this._dataDom) {
      this._dataDom.innerHTML = html;
    }
  }
  /**
   * @description 渲染脚部
   * @author angle
   * @date 2020-05-21
   * @private
   * @param {IAchievement} data 统计数据
   * @memberof BlockBar
   */
  private _renderTableFooter(data: IAchievement): void {
    if (this._footerDom) {
      this._footerDom.innerHTML =
        '<li class="item box-label">合计</li>' +
        `<li class="item">${data.orderNumber}</li>` +
        `<li class="item">${data.platformDiscount}</li>` +
        `<li class="item">${data.shopDiscount}</li>` +
        `<li class="item">${data.subsidy}</li>` +
        `<li class="item">${data.sendPrice}</li>` +
        `<li class="item">${data.sendDistance}</li>`;
    }
  }

  /**
   *Creates an instance of BlockBar.
   * @author angle
   * @date 2020-05-20
   * @param {string} dateInpId 日期输入框id
   * @param {string} reportId 图表容器id
   * @param {IAchievement[]} [initData=[]] 初始化数据
   * @memberof BlockBar
   */
  constructor(dateInpId: string, reportId: string, initData: IAchievement[] = []) {
    super(dateInpId, reportId, DATETYPE.DAY);
    this.init(initData);
  }

  public renderData(data: IAchievement[]): void {
    this._renderBar(data.map<number>((item) => item.orderNumber));
    const { html, ...totalData } = this._emitTableObj(data);
    this._renderTableBody(html);
    this._renderTableFooter(totalData);
  }
}

export default BlockBar;
