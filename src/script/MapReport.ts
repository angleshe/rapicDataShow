import MalaysiaMapData from './Malaysia.json';
import Echart, { ECharts } from 'echarts';

type BaseDataType = { name: string; value: number };
interface IAreaData {
  name: string;
  value: string;
}

Echart.registerMap('Malaysia', MalaysiaMapData);
/**
 * @description 地图图表
 * @author angle
 * @date 2020-05-21
 * @class MapReport
 * @template DataType 数据结构
 */
class MapReport<DataType extends BaseDataType = BaseDataType> {
  /**
   * @description 州选择框默认值
   * @static
   * @type {string}
   * @memberof MapReport
   */
  static readonly STATEDEFAULT: string = '全国';

  /**
   * @description 区选择框默认值
   * @static
   * @type {string}
   * @memberof MapReport
   */
  static readonly AREADEFAULT: string = '区';

  /**
   * @description 州数据
   * @private
   * @type {DataType[]}
   * @memberof MapReport
   */
  private _stateData: DataType[] = [];
  /**
   * @description 地图dom
   * @private
   * @type {(HTMLDivElement | null)}
   * @memberof MapReport
   */
  private readonly _mapDom: HTMLDivElement | null;

  /**
   * @description 州选择框dom集
   * @private
   * @type {({
   *     select: HTMLButtonElement | null; 下拉选择框
   *     menu: HTMLDivElement | null; 菜单
   *     clickEvent: EventListenerOrEventListenerObject; 点击事件
   *   })}
   * @memberof MapReport
   */
  private readonly _stateSelectDom: {
    select: HTMLButtonElement | null;
    menu: HTMLDivElement | null;
    clickEvent: EventListenerOrEventListenerObject;
  };

  /**
   * @description 区选择框dom集
   * @private
   * @type {({
   *     container: HTMLDivElement | null; 容器
   *     select: HTMLButtonElement | null; 下拉选择框
   *     menu: HTMLDivElement | null; 菜单
   *     clickEvent: EventListenerOrEventListenerObject; 点击事件
   *   })}
   * @memberof MapReport
   */
  private readonly _areaSelectDom: {
    container: HTMLDivElement | null;
    select: HTMLButtonElement | null;
    menu: HTMLDivElement | null;
    clickEvent: EventListenerOrEventListenerObject;
  };

  /**
   * @description 图表处理对象
   * @private
   * @type {(ECharts | null)}
   * @memberof MapReport
   */
  private _echarts: ECharts | null = null;
  /**
   * @description 地址改变事件
   * @private
   * @type {(Function | undefined)}
   * @memberof MapReport
   */
  private _addChangeHandler: Function | undefined;

  /**
   * @description 初始化
   * @author angle
   * @date 2020-05-22
   * @private
   * @memberof MapReport
   */
  private _init(): void {
    if (this._mapDom) {
      this._echarts = Echart.init(this._mapDom);
      this.renderData(this._stateData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this._echarts.on('click', ({ data }: any) => {
        this._stateSelectDom.select && (this._stateSelectDom.select.innerText = data.name);
        this._addChangeHandler && this._addChangeHandler(data);
      });
    }
  }
  /**
   * @description 生成菜单html
   * @author angle
   * @date 2020-05-23
   * @private
   * @param {IAreaData[]} data 数据
   * @returns {string}
   * @memberof MapReport
   */
  private _createdMenuHtml(data: IAreaData[]): string {
    return data.reduce<string>(
      (prev, curr, index) =>
        prev +
        `<button type="button" class="dropdown-item" data-value="${curr.value}" data-index="${index}">${curr.name}</button>`,
      ''
    );
  }
  /**
   * @description 初始化下拉选择框
   * @author angle
   * @date 2020-05-23
   * @private
   * @memberof MapReport
   */
  private _initSelect(): void {
    this.refreshSelect();
    if (this._stateSelectDom.menu) {
      this._stateSelectDom.menu.innerHTML = this._createdMenuHtml(
        this._stateData.map<IAreaData>((item) => ({
          name: item.name,
          value: item.name
        }))
      );
    }
    this._bindSelectEvent();
  }
  /**
   * @description 绑定下拉框事件
   * @author angle
   * @date 2020-05-24
   * @private
   * @memberof MapReport
   */
  private _bindSelectEvent(): void {
    this._unbindSelectEvent();
    this._stateSelectDom.menu?.addEventListener('click', this._stateSelectDom.clickEvent);
    this._areaSelectDom.menu?.addEventListener('click', this._areaSelectDom.clickEvent);
  }

  /**
   * @description 解绑下拉框事件
   * @author angle
   * @date 2020-05-24
   * @private
   * @memberof MapReport
   */
  private _unbindSelectEvent(): void {
    this._stateSelectDom.menu?.removeEventListener('click', this._stateSelectDom.clickEvent);
    this._areaSelectDom.menu?.removeEventListener('click', this._areaSelectDom.clickEvent);
  }
  /**
   *Creates an instance of MapReport.
   * @author angle
   * @date 2020-05-21
   * @param {string} mapDomId map容器id
   * @param {DataType[]} [initData=[]] 初始化数据
   * @memberof MapReport
   */
  constructor(mapDomId: string, selectId: string, initData: DataType[] = []) {
    const dom: HTMLElement | null = document.getElementById(mapDomId);
    this._mapDom = dom instanceof HTMLDivElement ? dom : null;
    this._stateSelectDom = {
      menu: document.querySelector<HTMLDivElement>(`#${selectId} .state .dropdown-menu`),
      select: document.querySelector<HTMLButtonElement>(`#${selectId} .state .address-select-btn`),
      clickEvent: ({ target }): void => {
        if (target instanceof HTMLButtonElement && target.className === 'dropdown-item') {
          const name: string = target.getAttribute('data-value') ?? MapReport.STATEDEFAULT;
          this._stateSelectDom.select && (this._stateSelectDom.select.innerText = name);
          this._addChangeHandler &&
            this._addChangeHandler(
              this._stateData?.[parseInt(target.getAttribute('data-index') ?? '0')] ?? { name }
            );
        }
      }
    };
    this._areaSelectDom = {
      container: document.querySelector<HTMLDivElement>(`#${selectId} .area`),
      menu: document.querySelector<HTMLDivElement>(`#${selectId} .area .dropdown-menu`),
      select: document.querySelector<HTMLButtonElement>(`#${selectId} .area .address-select-btn`),
      clickEvent: ({ target }): void => {
        if (target instanceof HTMLButtonElement && target.className === 'dropdown-item') {
          const name: string = target.getAttribute('data-value') ?? MapReport.STATEDEFAULT;
          this._areaSelectDom.select && (this._areaSelectDom.select.innerText = target.innerText);
          this._addChangeHandler && this._addChangeHandler({ name });
        }
      }
    };
    this._stateData = initData;
    this._init();
  }

  /**
   * @description 数据渲染
   * @author angle
   * @date 2020-05-22
   * @param {DataType[]} data
   * @memberof MapReport
   */
  public renderData(data: DataType[]): void {
    this._stateData = data;
    this._initSelect();
    this._echarts?.setOption({
      visualMap: [
        {
          type: 'piecewise',
          splitNumber: 4,
          pieces: [
            { min: 900, label: '900及以上', color: '#77fafd' },
            { max: 900, min: 600, label: '600~900', color: '#5ac5cb' },
            { max: 600, min: 300, label: '300~600', color: '#449ba8' },
            { max: 300, label: '0~300', color: '#286381' }
          ],
          left: 'right',
          textStyle: {
            color: '#fff'
          }
        }
      ],
      series: [
        {
          type: 'map',
          map: 'Malaysia',
          data,
          label: {
            emphasis: {
              color: '#fff',
              offset: [20, -20]
            }
          },
          center: [6203, 6028],
          zoom: 1.5
        }
      ]
    });
  }
  /**
   * @description 事件监听
   * @author angle
   * @date 2020-05-22
   * @param {'addresschange'} eventName 事件名
   * @param {Function} handler 处理函数
   * @memberof MapReport
   */
  public addEventListener(eventName: 'addresschange', handler: Function): void {
    if (eventName === 'addresschange') {
      this._addChangeHandler = handler;
    }
  }
  /**
   * @description 事件移除
   * @author angle
   * @date 2020-05-22
   * @param {'addresschange'} eventName 事件名
   * @memberof MapReport
   */
  public removeEventListener(eventName: 'addresschange'): void {
    if (eventName === 'addresschange') {
      this._addChangeHandler = undefined;
    }
  }

  /**
   * @description 渲染区菜单
   * @author angle
   * @date 2020-05-24
   * @param {IAreaData[]} data 菜单数据
   * @memberof MapReport
   */
  public renderAreaMenu(data: IAreaData[]): void {
    this._areaSelectDom.select && (this._areaSelectDom.select.innerText = MapReport.AREADEFAULT);
    this._areaSelectDom.menu && (this._areaSelectDom.menu.innerHTML = this._createdMenuHtml(data));
    this._areaSelectDom.container && (this._areaSelectDom.container.style.display = 'block');
  }

  /**
   * @description 刷新选择框
   * @author angle
   * @date 2020-05-24
   * @memberof MapReport
   */
  public refreshSelect(): void {
    this._areaSelectDom.container && (this._areaSelectDom.container.style.display = 'none');
    this._stateSelectDom.select && (this._stateSelectDom.select.innerText = MapReport.STATEDEFAULT);
  }
}

export default MapReport;
