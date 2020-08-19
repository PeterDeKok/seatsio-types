export interface Seatsio {

    /**
     *  Constructor for seating chart.
     *
     *  Should be called with minimal config.
     *  @see https://docs.seats.io/docs/renderer-configure-your-floor-plan
     */
    SeatingChart: { new(config?: seatsio.OriginalConfig): seatsio.SeatingChart };

    /**
     *  Collection of initialized charts.
     */
    charts: seatsio.SeatingChart[];

    /**
     *  Whether or not multiple charts are initialized on the page.
     *
     *  | value | description                 |
     *  | ----- | ----------------------------|
     *  | null  | iff no charts initialized   |
     *  | true  | iff one chart initialized   |
     *  | false | iff more charts initialized |
     */
    isFirstChartOnPage: boolean;

    /**
     *  Retrieve a specific SeatingChart instance by providing
     *  the iFrame's content window element.
     */
    getChart: (el: Window) => seatsio.SeatingChart | void;

    /**
     *  Destroy all initialized charts.
     *
     *  @todo
     */
    destroyCharts: () => void;

    /**
     *  @todo
     */
    onLoad: () => void;

    /**
     *  The version string of the library.
     */
    version: string;

    /**
     *  Not typed (yet).
     *
     *  Some of these properties might be redundant for most (if not all) implementations.
     *  Or should explicitly not be made public.
     *
     *  @todo
     */
    // CDNStaticFilesUrl
    // CDNThumbnailsUrl
    // CDNUrl
    // ChartManager
    // DOMElementListener
    // Element
    // Embeddable
    // EventManager
    // FullScreenManager
    // MAX_Z_INDEX
    // SeatingChartConfigValidator
    // SeatingChartDesigner
    // SeatsioDummyStorage
    // SeatsioSessionStorage
    // SeatsioStorage
    // ablySubscribeKey
    // dataCollectorUrl
    // environment
    // error
    // removeFromArray
    // v2Url
    // warn

}

declare namespace seatsio {

    class SeatingChart {

        public config: Config;
        public containerVisible: Promise<void>

        /**
         *  The hold token, which is sent to the server when an object is selected.
         *
         *  @see https://docs.seats.io/docs/renderer-chart-properties-chartholdtoken
         */
        public holdToken: string | null;

        public iframe: HTMLIFrameElement | null;

        public originalConfig: OriginalConfig;

        /**
         *  @deprecated
         */
        public reservationToken: null;

        /**
         *  Array containing the labels of the objects the user has selected.
         *
         *  @see https://docs.seats.io/docs/renderer-chart-properties-chartselectedobjects
         */
        public selectedObjects: string[];

        public selectedObjectsInput: null;

        /**
         *  @deprecated
         */
        public selectedSeats: string[];

        public state: 'INITIAL' | 'RENDERING' | 'DESTROYED'; // TODO Add other possible types

        constructor(config?: OriginalConfig);

        /**
         *  Renders the chart inside the specified container divId.
         *
         *  This creates an iFrame as a child node of the container div,
         *  and optionally some hidden input fields,
         *  if selectedObjectsInputName and/or holdTokenInputName being set to true.
         *
         *  @see https://docs.seats.io/docs/renderer-chart-properties-chartrender
         */
        public render(): SeatingChart;

        /**
         *  Removes the chart iFrame from the DOM tree,
         *  removes DOM event listeners and removes the chart from the seatsio.charts array.
         *
         *  @see https://docs.seats.io/docs/renderer-chart-properties-chartdestroy
         */
        public destroy(): void;

        /**
         *  Re-initializes and redraws the chart.
         *
         *  Previously selected objects become unselected.
         *
         *  @see https://docs.seats.io/docs/renderer-chart-properties-chartrerender
         */
        public rerender(): void;

        /**
         *  Resets the chart 'view'
         *
         *  - Any visible modal windows (e.g. a ticket type selector) are closed
         *  - the chart is zoomed out to its initial zoom level
         *
         *  Unlike chart.rerender(), the chart data is not fetched again,
         *  and the current selection and hold token are left untouched.
         *
         *  @see https://docs.seats.io/docs/chartresetview
         */
        public resetView(): void;

        /**
         *  Previously selected objects become unselected, a fresh hold token is generated,
         *  and the seating chart is re-initialized.
         *
         *  This method takes two optional callback parameters: one for success, one for failure.
         *
         *  @see https://docs.seats.io/docs/chartstartnewsession
         */
        public startNewSession(successCallback?: () => void, failureCallback?: () => void): void;

        /**
         *  Selects best available objects (and deselects any already selected objects).
         *
         *  🚧 Do not use this function if you expect high load on-sales
         *
         *  @see https://docs.seats.io/docs/renderer-config-selectbestavailable
         */
        public selectBestAvailable(config: BestAvailable): void;

        /**
         *  Deselects the currently selected objects.
         *
         *  @see https://docs.seats.io/docs/renderer-chart-properties-chartclearselection
         */
        public clearSelection(successCallback?: () => void, failureCallback?: () => void): void;

        /**
         *  Selects matched objects.
         *
         *  @see https://docs.seats.io/docs/renderer-chart-properties-chartselectobjects
         */
        public selectObjects(objects: string[] | { id: string; ticketType?: string; amount?: number; }[], successCallback?: () => void, failureCallback?: () => void): void;

        /**
         *  Deselects matched objects.
         *
         *  @see https://docs.seats.io/docs/renderer-chart-properties-chartdeselectobjects
         */
        public deselectObjects(objects: string[] | { id: string; ticketType?: string; amount?: number; }[], successCallback?: () => void, failureCallback?: () => void): void;

        /**
         *  Selects all the objects in the categories.
         *
         *  @see https://docs.seats.io/docs/renderer-chart-properties-chartselectcategories
         */
        public selectCategories(categoryIds: string[], successCallback?: () => void, failureCallback?: () => void): void;

        /**
         *  Deselects all the objects in the categories.
         *
         *  @see https://docs.seats.io/docs/renderer-chart-properties-chartdeselectcategories
         */
        public deselectCategories(categoryIds: string[], successCallback?: () => void, failureCallback?: () => void): void;

        /**
         *  @deprecated
         *
         *  Makes the specified categories unavailable from selection.
         *
         *  📘 This method is superseded by `changeConfig()`.
         *
         *  🚧 Warning: Calling this method will clear the current selection.
         *
         *  @see https://docs.seats.io/docs/chartsetunavailablecategories
         */
        public setUnavailableCategories(labelsOrIds: (string | number)[]): void;

        /**
         *  @deprecated
         *
         *  Makes the specified categories available for selection,
         *  while making all others unavailable from selection.
         *
         *  📘 This method is superseded by `changeConfig()`.
         *
         *  🚧 Warning: Calling this method will deselect any object whose category was made unavailable.
         *
         *  @see https://docs.seats.io/docs/chartsetavailablecategories
         */
        public setAvailableCategories(labelsOrIds: (string | number)[]): void;

        /**
         *  @deprecated
         *
         *  Leaves the specified categories normally visible,
         *  while making all others dimmed out.
         *
         *  📘 This method is superseded by `changeConfig()`.
         *
         *  🚧
         *  Notice:
         *  This does not make any categories available or unavailable from selection,
         *  and it's meant to be used as a visual filter/aid only.
         */
        public setFilteredCategories(labelsOrIds: (string | number)[]): void;

        /**
         *  Change the configuration of the chart.
         *
         *  The chart is re-rendered after configuration changes.
         *
         *  @see https://docs.seats.io/docs/renderer-chart-properties-chartchangeconfig
         */
        public changeConfig(config: ChangeableConfig): void;

        /**
         *  Asynchronously finds an object on the chart.
         *
         *  If the object was found, successCallback is invoked with the object as parameter.
         *  Otherwise, objectNotFoundCallback is invoked.
         *
         *
         *  @see https://docs.seats.io/docs/renderer-chart-properties-chartfindobject
         */
        public findObject(label: string, successCallback?: (object: BookableObject) => void, objectNotFoundCallback?: () => void): void;

        /**
         *  Asynchronously fetches the chart categories.
         *
         *  Useful to build a custom chart legend.
         *
         *  @see https://docs.seats.io/docs/renderer-chart-properties-chartlistcategories
         */
        public listCategories(callback: (object: Category[]) => void): void;

        /**
         *  Zooms to the currently selected objects, adjusting zoom level and viewport position.
         *
         *  If no objects are selected, no zooming is done.
         *
         *  @see https://docs.seats.io/docs/renderer-chart-properties-chartzoomtoselectedobjects
         */
        public zoomToSelectedObjects(): void;

        /**
         *  Asynchronously lists all selected objects with their properties.
         *
         *  The provided callback is invoked on each selected object.
         *
         *  @see https://docs.seats.io/docs/chartlistselectedobjects
         */
        public listSelectedObjects(selectedObjectsCallback: (selectedObject: BookableObject) => void): void;


        /**
         *  Not typed (yet).
         *
         *  These properties might be redundant for most (if not all) implementations.
         *  Or should explicitly not be made public.
         *
         *  @todo
         */
        // domElementListener: null
        // errorSentToDataCollector: false
        // iframeElementListener: null
        // initialContainerDimensions: null
        // requestCallbacks: {}
        // requestErrorCallbacks: {}
        // requestIdCtr: 0
        // seatsioLoadedDeferred: m {promise: Promise, reject: ƒ, resolve: ƒ}
        // sentWarnings: []
        // storage: r.SeatsioSessionStorage {}

    }

    /**
     *  All changeable (and optional) settings for constructing
     *  a new SeatingChart object or changing config on an existing SeatingChart object.
     */
    export interface ChangeableConfig {

        /**
         *  A function that determines the object color.
         *
         *  Must return a CSS string (e.g. `red` or `#ccc`).
         *
         *  🚧
         *  Warning:
         *  This function is called for each object on the chart;
         *  make sure it's fast, or chart rendering times will suffer.
         *  Avoid using slow methods such as Array.indexOf.
         *
         *  @see https://docs.seats.io/docs/renderer-config-objectcolor
         */
        objectColor?: (object: BookableObject, defaultColor: string, extraConfig: ExtraConfig) => string;

        /**
         *  A function that determines the label that's rendered inside an object on the chart.
         *
         *  By default, no label is shown.
         *  The size of an object label is calculated automatically,
         *  based on the size of the object.
         *  For tables and booths, there usually is more than enough space.
         *  For seats, however, you'll probably want to limit the label to 3 characters maximum,
         *  or else the label will become too small to read without zooming in.
         *
         *  🚧
         *  Warning:
         *  This function is called for each object on the chart;
         *  make sure it's fast, or chart rendering times will suffer.
         *  Avoid using slow methods such as Array.indexOf.
         *
         *  @see https://docs.seats.io/docs/renderer-config-objectlabel
         */
        objectLabel?: (object: BookableObject, defaultLabel: string, extraConfig: ExtraConfig) => string;

        /**
         *  Activates one-click selection mode.
         *
         *  If you pass in numberOfPlacesToSelect: 3,
         *  the ticket buyer only needs to click once to select 3 places.
         *
         *  🚧 Previously selected places are deselected automatically.
         *
         *  @see https://docs.seats.io/docs/renderer-config-numberofplacestoselect
         */
        numberOfPlacesToSelect?: number;

        /**
         *  Limit the number of objects a user can select.
         *
         *  When using a number X, the user will be able to select a max of X objects overall.
         *  And you can also limit the selection per category.
         *
         *  @see https://docs.seats.io/docs/renderer-config-maxselectedobjects
         */
        maxSelectedObjects?: number | { quantity: number, ticketType?: string, category?: string | number }[];

        /**
         *  The ticketListings parameter is useful when you're selling tickets for which you only know the section name,
         *  but not the exact row or the seat.
         *
         *  If you pass in ticketListings, the sections that have tickets available become selectable.
         *  So clicking on a section selects the section, instead of zooming in to the seats inside that section.
         *
         *  This parameter requires you to pass in a chart key instead of an event key.
         *
         *  @see https://docs.seats.io/docs/renderer-config-ticketlistings
         */
        ticketListings?: TicketListing[];

        /**
         *  Some callbacks (e.g. objectLabel) do not have access to
         *  variables defined in your web page.
         *  That's because they're executed inside the seats.io iFrame.
         *
         *  With extraConfig, you can pass in an object to which the callbacks do have access.
         *  It's passed to them as the last parameter.
         *
         *  The following callbacks are executed within the iFrame and they receive an extraConfig parameter:
         *  objectColor, sectionColor, objectLabel, objectIcon,
         *  objectCategory, isObjectVisible, canGASelectionBeIncreased
         *
         *  @see https://docs.seats.io/docs/renderer-config-extraconfig
         */
        extraConfig?: any; // TODO Proper type

        /**
         *  Makes the specified categories available from selection,
         *  while making all others unavailable from selection.
         *
         *  The array can be a list of category IDs or labels.
         *
         *  @see https://docs.seats.io/docs/availablecategories
         */
        availableCategories?: (number | string)[];

        /**
         *  Makes the specified categories unavailable from selection.
         *
         *  The array can be a list of category IDs or labels.
         *
         *  @see https://docs.seats.io/docs/renderer-config-unavailablecategories
         */
        unavailableCategories?: (number | string)[];

        /**
         *  Leaves the specified categories normally visible,
         *  while making all others dimmed out.
         *
         *  The array can be a list of category IDs or labels.
         *
         *  📘
         *  Notice:
         *  This does not make any categories available or unavailable from selection,
         *  and it's meant to be used as a visual filter/aid only.
         *
         *  @see https://docs.seats.io/docs/filteredcategories
         */
        filteredCategories?: (number | string)[];

        /**
         *  Seats supports two types of pricing
         *
         *  Simple pricing - is pretty, well, simple: there's a single price point per category.
         *  Multi-level pricing - is for when you want to offer multiple price points within the same category.
         *
         *  🚧 Category labels need to be 100% correct when used as keys.
         *
         *  @see https://docs.seats.io/docs/renderer-config-pricing
         */
        pricing?: PricingConfig[];

    }

    /**
     *  All (optional) settings for constructing a new SeatingChart object.
     */
    export interface OriginalConfig extends ChangeableConfig {

        /**
         *  The id of the (`<div>`) element on your page in which you want seats.io to render the seating chart.
         *
         *  Defaults to `chart`
         *
         *  ❗ Note: `divId` is a required configuration option!
         *  @seatsio: The code says it defaults to 'chart' (??)
         *
         *  @see https://docs.seats.io/docs/renderer-config-divid
         */
        divId?: string | 'chart';

        /**
         *  The key of the event for which you want to render the seating chart.
         *
         *  ❗ Note: One of `event`, `events` or `chart` is a required configuration option!
         *
         *  The 'events' parameter can be used instead of this.
         *
         *  @see https://docs.seats.io/docs/renderer-config-event
         */
        event?: string;

        /**
         *  The keys of the events for which you want to render the seating chart.
         *
         *  Useful to implement season tickets functionality.
         *  If an object is booked for one (or more) events in the list,
         *  it will show up as booked for the 'season'.
         *
         *  ❗ Note: Cannot be used together with the `event` or `chart` parameter.
         *
         *  ❗ Note: One of `event`, `events` or `chart` is a required configuration option!
         *
         *  @see https://docs.seats.io/docs/renderer-config-events
         */
        events?: string[];

        /**
         *  The key of the chart for which you want to render the seating chart.
         *
         *  Only useful to implement when `ticketListings` is used.
         *
         *  ❗ Note: Cannot be used together with the `event` or `events` parameter.
         *
         *  ❗ Note: One of `event`, `events` or `chart` is a required configuration option!
         *
         *  @see https://docs.seats.io/docs/renderer-config-ticketlistings
         */
        chart?: string;

        /**
         *  The workspace key for the workspace in which the chart was created.
         *
         *  You can find it on your workspace settings page.
         *
         *  📘 This parameter used to be called publicKey.
         *
         *  @see https://docs.seats.io/docs/renderer-config-workspacekey
         */
        workspaceKey: string;

        /**
         *  @deprecated
         *
         *  📘 This parameter is superseded by `workspaceKey`.
         */
        publicKey?: string;

        /**
         *  Format a price when it's shown to an end user.
         *
         *  This is notably used in the tooltip you see when you hover over a seat.
         *
         *  🚧
         *  Note that the result of this function will be escaped,
         *  meaning you can't use html entities such as &#36;
         *
         *  @see https://docs.seats.io/docs/renderer-config-priceformatter
         */
        priceFormatter?: (price: number | string) => string;

        /**
         *  If set to `false`, objects that don't have pricing information
         *  will be rendered as not selectable (i.e. greyed out).
         *
         *  Defaults to `true`.
         *
         *  @see https://docs.seats.io/docs/renderer-config-objectwithoutpricingselectable
         */
        objectWithoutPricingSelectable?: boolean;

        /**
         *  If set to `false`, objects that don't have a category
         *  will be rendered as not selectable (i.e. greyed out).
         *
         *  Defaults to `true`.
         *
         *  @see https://docs.seats.io/docs/renderer-config-objectwithoutcategoryselectable
         */
        objectWithoutCategorySelectable?: boolean;

        /**
         *  Render the chart with the specified objects selected (if they are still free).
         *
         *  @see https://docs.seats.io/docs/renderer-config-selectedobjects
         */
        selectedObjects?: (string | { label: string; ticketType: string; })[];

        /**
         *  @deprecated
         *
         *  📘 This parameter is superseded by `selectedObjects`.
         */
        selectedSeats?: (string | { label: string; ticketType: string; })[];

        /**
         *  Allows to toggle on or off some features of the cursor tooltip,
         *  displayed when hovering objects on mouse-input devices like laptops and desktop computers.
         *
         *  Parameters that aren't passed will use their default values instead.
         *
         *  @see https://docs.seats.io/docs/renderer-config-objecttooltip
         */
        objectTooltip?: {
            showActionHint?: boolean,
            showAvailability?: boolean,
            showCategory?: boolean,
            showLabel?: boolean,
            showPricing?: boolean,
            showUnavailableNotice?: boolean,
            stylizedLabel?: boolean,
            confirmSelectionOnMobile?: string | 'auto',
        };

        /**
         *  @deprecated
         *
         *  📘 This parameter is superseded by `objectTooltip`.
         */
        mobileTooltip?: never;

        /**
         *  A function whose result will be displayed as extra information on the cursor tooltip.
         *
         *  Can be formatted using a simple BBCode format:
         *
         *  🚧
         *  tooltipInfo is triggered for all objects, including sections.
         *  You can use object.objectType to distinguish between object types
         *  (e.g. to implement a specific tooltip for sections).
         *
         *  @see https://docs.seats.io/docs/renderer-config-tooltipinfo
         */
        tooltipInfo?: (object: BookableObject) => string;

        /**
         *  @deprecated
         *
         *  📘 This parameter is superseded by `colorScheme`.
         */
        themePreset?: never;

        /**
         *  @deprecated
         *
         *  📘 This parameter is superseded by `colors`.
         */
        themeColor?: never;

        /**
         *  Sets the language for built-in texts in seats.io.
         *
         *  For the list of supported languages, check this page.
         *
         *  @see https://docs.seats.io/docs/renderer-config-language
         */
        language?: string;

        /**
         *  The messages parameter allows you to change all kinds of texts that are displayed on the chart:
         *  - section labels
         *  - tooltip texts
         *  - static text objects
         *  - ... you name it.
         *
         *  Just pass in an object with the original texts as keys, and the translations as values.
         *
         *  @see https://docs.seats.io/docs/renderer-config-messages
         */
        messages?: { [original_text: string]: string };

        /**
         *  The message that's shown above the price levels,
         *  when clicking on an object belonging to a category
         *  that has multiple price levels (e.g. child and adult).
         *
         *  @see https://docs.seats.io/docs/renderer-config-pricelevelstooltipmessage
         */
        priceLevelsTooltipMessage?: string;

        /**
         *  If your chart div is enclosed within a `<form>` element,
         *  you can use this configuration option to automatically add the selected seat IDs to the form data.
         *
         *  This is one of the ways you can pass the selected seats to your server,
         *  so that you can book them later on through the Seats API.
         *
         *  @see https://docs.seats.io/docs/renderer-config-selectedobjectsinputname
         */
        selectedObjectsInputName?: string;

        /**
         *  @deprecated
         *
         *  📘 This parameter is superseded by `selectedObjectsInputName`.
         */
        selectedSeatsInputName?: string;

        /**
         *  @deprecated
         *
         *  📘 This parameter is superseded by `objectColor`.
         */
        seatColor?: (object: BookableObject, defaultColor: string, extraConfig: ExtraConfig) => string;

        /**
         *  A function that determines the section color.
         *
         *  Must return a CSS string (e.g. `red` or `#ccc`).
         *
         *  @see https://docs.seats.io/docs/renderer-config-sectioncolor
         */
        sectionColor?: (section: SectionObject, defaultColor: string, extraConfig: ExtraConfig) => string;

        /**
         *  @deprecated
         *
         *  📘 This parameter is superseded by `objectLabel`.
         */
        seatLabel?: (object: BookableObject, defaultLabel: string, extraConfig: ExtraConfig) => string;

        /**
         *  A function that returns the name of an icon.
         *
         *  The icon name should be a [FontAwesome] (version 4.7.0) icon.
         *
         *  🚧
         *  Warning:
         *  This function is called for each object on the chart;
         *  make sure it's fast, or chart rendering times will suffer.
         *  Avoid using slow methods such as Array.indexOf.
         *
         *  @see https://docs.seats.io/docs/renderer-config-objecticon
         */
        objectIcon?: (object: BookableObject, defaultIcon: string, extraConfig: ExtraConfig) => string;

        /**
         *  @deprecated
         *
         *  📘 This parameter is superseded by `objectIcon`.
         */
        seatIcon?: (object: BookableObject, defaultIcon: string, extraConfig: ExtraConfig) => string;

        /**
         *  A function that should return true if an object is visible, and false otherwise.
         *
         *  When an object is invisible, it can't be selected or interacted with.
         *
         *  The object types that can be made invisible are: "seat", "table", "booth", "generalAdmission" and "section".
         *
         *  🚧
         *  Warning:
         *  This function is called for each object on the chart;
         *  make sure it's fast, or chart rendering times will suffer.
         *  Avoid using slow methods such as Array.indexOf.
         *
         *  @see https://docs.seats.io/docs/renderer-config-isobjectvisible
         */
        isObjectVisible?: (object: BookableObject, extraConfig: ExtraConfig) => string;

        /**
         *  This function is invoked when a user clicks on a GA area.
         *
         *  If canGASelectionBeIncreased returns true, the user is able
         *  to increase the number of selected places by clicking on
         *  the + button of the ticket selector that pops up.
         *
         *  @todo: Is `ticketType: string` correct??
         *
         *  @see https://docs.seats.io/docs/renderer-config-cangaselectionbeincreased
         */
        canGASelectionBeIncreased?: (gaArea: GeneralAdmissionObject, defaultValue: boolean, extraConfig: ExtraConfig, ticketType: string) => boolean;

        /**
         *  Automatically pre-select the best available objects
         *  (and deselect already selected objects).
         *
         *  🚧 Do not use this config param if you expect high load on-sales
         *
         *  @see https://docs.seats.io/docs/renderer-config-selectbestavailable
         */
        selectBestAvailable?: BestAvailable;

        /**
         *  Set to true to show little lines between seats of the same row.
         *
         *  This may help to indicate which seats belong to the same row.
         *
         *  🚧 showRowLines is not supported on mobile. Passing it in has no effect.
         *
         *  @see https://docs.seats.io/docs/renderer-config-showrowlines
         */
        showRowLines?: boolean;

        /**
         *  @deprecated
         *
         *  📘 This parameter is deprecated. You can indicate which row labels are shown through the designer.
         *
         *  @see https://docs.seats.io/docs/renderer-config-showrowlabels
         */
        showRowLabels?: boolean;

        /**
         *  If alwaysShowSectionContents is set to true, section contents will always be rendered.
         *
         *  Only useful for charts with sections.
         *
         *  The normal behaviour for charts with sections, is to show section contents
         *  (rows of seats, tables, etc) only after zooming in,
         *  or when the available screen size is large enough.
         *
         *  @see https://docs.seats.io/docs/renderer-config-alwaysshowsectioncontents
         */
        alwaysShowSectionContents?: boolean;

        /**
         *  Start a session to temporarily hold objects upon selection.
         *
         *  A session lasts for 15 minutes (or whatever you set on your settings page).
         *  When the ticket buyer clicks on a place within that period, it gets held.
         *  Other users won't be able to book the same place within that period.
         *  If the place is not booked (e.g. payment has never been received) before the end of the session,
         *  it's automatically released again.
         *
         *  @see https://docs.seats.io/docs/renderer-config-session
         */
        session?: 'continue' | 'start' | 'manual' | 'none';

        /**
         *  When starting a session, a hold token is generated and stored in the browser's session storage.
         *
         *  That way, the hold token will still available after a page refresh,
         *  allowing the renderer to re-select the previously selected and held seats.
         *
         *  But you can also create a hold token through our API.
         *  If you do so, set session to manual when rendering the chart,
         *  and pass in the holdToken parameter.
         *
         *  @see https://docs.seats.io/docs/renderer-config-holdtoken
         */
        holdToken?: string;

        /**
         *  @deprecated
         *
         *  📘 This parameter is superseded by `holdToken`.
         */
        reservationToken?: string;

        /**
         *  The name of the hidden input field that contains the hold token.
         *  Only makes sense when a session is active.
         *
         *  It will be created automatically - you should not create the input field yourself.
         *
         *  @see https://docs.seats.io/docs/renderer-config-holdtokeninputname
         */
        holdTokenInputName?: string;

        /**
         *  @deprecated
         *
         *  📘 This parameter is superseded by `holdTokenInputName`.
         */
        reservationTokenInputName?: string;

        /**
         *  Accounts created before 2018/11/22 don't have hold on select for GAs enabled by default.
         *
         *  For those accounts, selecting GA places does not cause them to be held,
         *  even when a hold on select session is enabled through the session parameter.
         *  Pass in holdOnSelectForGAs: true to activate it.
         *  More recent accounts don't need to do this: they have it enabled by default.
         *
         *  @see https://docs.seats.io/docs/renderer-config-holdonselectforgas
         */
        holdOnSelectForGAs?: boolean;

        /**
         *  @deprecated
         *
         *  📘 This parameter is deprecated. Use `session` instead.
         *
         *  @see https://docs.seats.io/docs/renderer-config-holdonselect
         */
        holdOnSelect?: boolean;

        /**
         *  @deprecated
         *
         *  📘
         *  This parameter is superseded by `holdOnSelect`.
         *  Note however, that parameter is deprecated as well!
         *  Use `session` instead.
         */
        reserveOnSelect?: boolean;

        /**
         *  @deprecated
         *
         *  📘 This parameter is deprecated. Use `session` instead.
         *
         *  @see https://docs.seats.io/docs/renderer-config-regenerateholdtoken
         */
        regenerateHoldToken?: boolean;

        /**
         *  @deprecated
         *
         *  📘
         *  This parameter is superseded by `regenerateHoldToken`.
         *  Note however, that parameter is deprecated as well!
         *  Use `session` instead.
         */
        regenerateReservationToken?: boolean;

        /**
         *  If true, a legend with the category names and colors is rendered at the top of the chart.
         *
         *  @see https://docs.seats.io/docs/renderer-config-legend
         */
        showLegend?: boolean;

        /**
         *  Determine which parts of the legend to show.
         *
         *  @see https://docs.seats.io/docs/renderer-config-legend
         */
        legend?: {
            hideNonSelectableCategories?: boolean;
            hidePricing?: boolean;
        };

        /**
         *  If true, users can select multiple seats at once
         *  by holding shift, clicking and dragging.
         *  Holding alt and click-dragging lets users select seats in 'lasso mode'.
         *
         *  @see https://docs.seats.io/docs/renderer-config-multiselectenabled
         */
        multiSelectEnabled?: boolean;

        /**
         *  When zoomed in on a chart with sections, a minimap is shown.
         *  So ticket buyers have a better sense which seats they're looking at.
         *
         *  @see https://docs.seats.io/docs/renderer-config-showminimap
         */
        showMinimap?: boolean;

        /**
         *  On mobile, when displaying a chart with sections,
         *  a tooltip is shown at the bottom of the screen with the section name and pricing,
         *  or a custom tooltip if tooltipText is provided.
         *
         *  @see https://docs.seats.io/docs/renderer-config-showactivesectiontooltiponmobile
         */
        showActiveSectionTooltipOnMobile?: boolean;

        /**
         *  On mobile, a view from seat thumbnail is displayed on the top left of the screen.
         *  Tapping this image will expand the thumbnail.
         *
         *  @see https://docs.seats.io/docs/renderer-config-showviewfromyourseatonmobile
         */
        showViewFromYourSeatOnMobile?: boolean;

        /**
         *  On desktop, a view from seat is displayed inside the tooltip when hovering a seat.
         *
         *  @see https://docs.seats.io/docs/renderer-config-showviewfromyourseatondesktop
         */
        showViewFromYourSeatOnDesktop?: boolean;

        /**
         *  Selection validators run every time a seat is selected or deselected.
         *
         *  They check whether there are no orphan seats,
         *  and/or whether all selected seats are consecutive.
         *
         *  If the selection is valid, onSelectionValid is triggered.
         *  If not, onSelectionInvalid is triggered.
         *
         *  @see https://docs.seats.io/docs/renderer-config-selectionvalidators
         */
        selectionValidators?: SelectionValidator[];

        /**
         *  The array of categories that you pass in to categories
         *  replaces the list of categories that were set through the designer.
         *
         *  This is mostly useful in combination with the objectCategories parameter.
         *
         *  @see https://docs.seats.io/docs/renderer-config-categories
         */
        categories?: CategoryConfig[];

        /**
         *  Used to enable or disable the category filter GUI,
         *  as well as configuring certain aspects of it.
         *
         *  The category filter allows the user to refine the search of tickets
         *  suitable for them without the need of coding any custom UI.
         *  It works for both desktop and mobile out of box.
         *
         *  @see https://docs.seats.io/docs/categoryfilter
         */
        categoryFilter?: {
            enabled: boolean;
            multiSelect: boolean;
            zoomOnSelect: boolean;
        };

        /**
         *  objectCategories allows you to override the categories that were
         *  assigned to objects through the designer.
         *
         *  @see https://docs.seats.io/docs/renderer-config-objectcategories
         */
        objectCategories?: { [objectLabel: string]: string | number };

        /**
         *  The objectCategory function allows the default category of an object to be overridden.
         *
         *  objectCategory must return a category object,
         *  either one retrieved from categories, or the defaultCategory.
         *
         *  @see https://docs.seats.io/docs/renderer-config-objectcategory
         */
        objectCategory?: (object: BookableObject, categories: CategoryList, defaultCategory: Category, extraConfig: ExtraConfig) => Category;

        /**
         *  Settings for selecting, zooming and panning
         *
         *  @see https://docs.seats.io/docs/renderer-config-mode
         */
        mode?: 'normal' | 'static' | 'print';

        /**
         *  This parameter allows you to override the default seats.io spinner that is shown while the floor plan is being loaded. The value can contain (valid) html, like so:
         *
         *  📘 Note that the any css class used in the loading html can be defined in the styling of your own page.
         */
        loading?: string; // HTML

        /**
         *  With fitTo, you can override the default guess of seats.io.
         *
         *  If your container div has no defined height at the time the chart is rendered,
         *  but you do want the chart to resize when the container height changes,
         *  you have to pass in fitTo: 'widthAndHeight'.
         *
         *  On the other hand,
         *  if you want the chart to only take the container width into account,
         *  pass in fitTo: 'width'.
         *
         *  @see https://docs.seats.io/docs/renderer-config-fitto
         */
        fitTo?: 'widthAndHeight' | 'width';

        /**
         *  @deprecated
         *
         *  📘
         *  This parameter is deprecated.
         *  Settings are inherited directly from the newer `objectTooltip` setting.
         *
         *  @see https://docs.seats.io/docs/renderer-config-cursortooltip
         */
        cursorTooltip?: never;

        /**
         *  When you zoom in on a seating chart, a button to reset the zoom level appears on the bottom left.
         *
         *  On desktop, this is the only way to zoom out again.
         *  But on mobile, users can use pinch-to-zoom,
         *  and so in that case this button is just a handy shortcut.
         *
         *  We recommend to keep it visible, but if need be,
         *  you can hide this button on mobile by passing showZoomOutButtonOnMobile: false.
         *
         *  @see https://docs.seats.io/docs/renderer-config-showzoomoutbuttononmobile
         */
        showZoomOutButtonOnMobile?: boolean;

        /**
         *  Whether to show the full screen button or not.
         *
         *  Defaults to true if your account was created after September 11th, 2019. False otherwise.
         *
         *  @see https://docs.seats.io/docs/renderer-config-showfullscreenbutton
         */
        showFullScreenButton?: boolean;

        /**
         *  If set to true, callbacks that are executed within the seats.io iFrame
         *  (e.g. objectColor and objectIcon) receive an object that has the same
         *  properties as objects passed to callbacks that are executed outside of the iFrame
         *  (e.g. onObjectSelected). Check our docs for a complete list of properties.
         *
         *  If false, the structure of inner-iFrame objects differs slightly from outer-iFrame objects.
         *
         *  For accounts created after May 15th 2019, this property is set to true by default.
         *
         *  You cannot set it to false.
         *
         *  @see https://docs.seats.io/docs/renderer-config-unifiedobjectpropertiesincallbacks
         */
        unifiedObjectPropertiesInCallbacks?: boolean;

        /**
         *  The keys of the channels you wish to make selectable.
         *
         *  Objects that have no channel assigned,
         *  or that have a channel assigned whose key is not in this list,
         *  will not be selectable.
         *
         *  @see https://docs.seats.io/docs/renderer-config-channels
         */
        channels?: string[];

        /**
         *  Sets the color scheme for the user interface.
         *
         *  The colors of certain floor plan elements, such as zoomed-in sections,
         *  will also be adjusted accordingly.
         *
         *  📘 When using the dark setting, notice that the background remains transparent.
         *
         *  @see https://docs.seats.io/docs/colorscheme
         */
        colorScheme?: 'light' | 'dark';

        /**
         *  Replaces certain colors of the current color scheme.
         *
         *  @see https://docs.seats.io/docs/colors
         */
        colors?: {
            colorSelected?: string;
            cursorTooltipBackgroundColor?: string;
            colorTitle?: string;
        }

        /**
         *  Sets the preset of styles to use for the seating chart user interface.
         *
         *  @see https://docs.seats.io/docs/stylepreset
         */
        stylePreset?: 'balance' | 'bubblegum' | 'flathead' | 'bezels' | 'leaf';

        /**
         *  Sets the intention for certain style properties,
         *  allowing to override the current style preset.
         *
         *  @see https://docs.seats.io/docs/style
         */
        style?: {
            font?: 'Roboto' | 'Montserrat' | 'WorkSans' | 'NotoSansHK' | 'Lato';
            fontWeight?: 'bolder' | 'minMax';
            borderRadius?: 'none' | 'max' | 'asymmetrical';
            border?: 'thick' | '3d';
            padding?: 'spacious';
            buttonFace?: 'fillEnabled' | 'fillHighlightedOption';
        }

        // TODO For all callbacks the return types are currently void.
        //  No callback seems to expect a return value,
        //  however this should be investigated to ensure this is assumption.

        /**
         *  Fired after the seating chart is fully rendered. The rendered chart is passed in as a parameter.
         *
         *  @see https://docs.seats.io/docs/renderer-events-onchartrendered
         */
        onChartRendered?: (chart: SeatingChart) => void;

        /**
         *  Fired when there's an error when rendering the chart.
         *
         *  @see https://docs.seats.io/docs/renderer-events-onchartrenderingfailed
         */
        onChartRenderingFailed?: (chart: SeatingChart) => void;

        /**
         *  Fired when the user clicks on an object.
         *
         *  🚧
         *  This event is fired even if the object in question was not selectable.
         *  To handle only valid object selections, use onObjectSelected instead.
         *
         *  @see https://docs.seats.io/docs/renderer-events-onobjectclicked
         */
        onObjectClicked?: () => void;

        /**
         *  Fired when the user selects an object.
         *
         *  @see https://docs.seats.io/docs/renderer-events-onobjectselected
         */
        onObjectSelected?: (object: BookableObject, selectedTicketType?: { price: number; ticketType?: string; }) => void;

        /**
         *  @deprecated
         *
         *  📘 This parameter is deprecated. Use `onObjectSelected` instead.
         */
        onSeatSelected?: never;

        /**
         *  Fired when the user deselects an object.
         *
         *  @see https://docs.seats.io/docs/renderer-events-onobjectdeselected
         */
        onObjectDeselected?: (object: BookableObject, deselectedTicketType?: { price: number; ticketType?: string; }) => void;

        /**
         *  @deprecated
         *
         *  📘 This parameter is deprecated. Use `onObjectDeselected` instead.
         */
        onSeatDeselected?: never;

        /**
         *  Fired when the user hovers an object.
         *
         *  @see https://docs.seats.io/docs/renderer-events-onobjectmouseover
         */
        onObjectMouseOver?: (object: BookableObject) => void;

        /**
         *  @deprecated
         *
         *  📘 This parameter is deprecated. Use `onObjectMouseOver` instead.
         */
        onSeatMouseOver?: never;

        /**
         *  Fired when the user unhovers an object.
         *
         *  @see https://docs.seats.io/docs/renderer-events-onobjectmouseout
         */
        onObjectMouseOut?: (object: BookableObject) => void;

        /**
         *  @deprecated
         *
         *  📘 This parameter is deprecated. Use `onObjectMouseOut` instead.
         */
        onSeatMouseOut?: never;

        /**
         *  Fired when the user has selected an object that gets booked by another user.
         *
         *  @see https://docs.seats.io/docs/renderer-events-onselectedobjectbooked
         */
        onSelectedObjectBooked?: (object: BookableObject) => void;

        /**
         *  @deprecated
         *
         *  📘 This parameter is deprecated. Use `onSelectedObjectBooked` instead.
         */
        onSelectedSeatBooked?: never;

        /**
         *  Fired when best available objects are successfully selected.
         *
         *  @see https://docs.seats.io/docs/renderer-events-onbestavailableselected
         */
        onBestAvailableSelected?: (objects: BookableObject[], nextToEachOther: boolean | null) => void;

        /**
         *  @deprecated
         *
         *  📘 This parameter is deprecated. Use `onBestAvailableSelected` instead.
         */
        onBestAvailableSeatsSelected?: never;

        /**
         *  Fired when no best available objects could be found,
         *  because there are not enough selectable objects available.
         *
         *  @see https://docs.seats.io/docs/renderer-events-onbestavailableselectionfailed
         */
        onBestAvailableSelectionFailed?: () => void;

        /**
         *  @deprecated
         *
         *  📘 This parameter is deprecated. Use `onBestAvailableSelectionFailed` instead.
         */
        onBestAvailableSeatsSelectionFailed?: never;

        /**
         *  When in a session, the user's browser will automatically hold selected places for a period of time.
         *
         *  If everything goes well, i.e. when the seats.io server indicates
         *  that a hold was successful, onHoldSucceeded is called.
         *
         *  @see https://docs.seats.io/docs/renderer-events-onholdsucceeded
         */
        onHoldSucceeded?: (objects: BookableObject[], ticketTypes?: { price: number; ticketType?: string; label?: string; }[]) => void;

        /**
         *  @deprecated
         *
         *  📘 This parameter is deprecated. Use `onHoldSucceeded` instead.
         */
        onReservationSucceeded?: never;

        /**
         *  When in a session, the user's browser will automatically hold selected places for a period of time,
         *  by issuing a direct API call to the Seats.io server.
         *
         *  In case this API call fails, e.g. because of a network error,
         *  the selected seats will automatically be unselected, and the onHoldFailed() callback is fired.
         *
         *  @see https://docs.seats.io/docs/renderer-events-onholdfailed
         */
        onHoldFailed?: (objects: BookableObject[], ticketTypes?: { price: number; ticketType?: string; label?: string; }[]) => void;

        /**
         *  @deprecated
         *
         *  📘 This parameter is deprecated. Use `onHoldFailed` instead.
         */
        onReservationFailed?: never;

        /**
         *  Fired when the hold token expires. At that time, a "session expired" dialog is also shown.
         *
         *  You can listen to this event to clear your shopping basket.
         *
         *  @see https://docs.seats.io/docs/renderer-events-onholdtokenexpired
         */
        onHoldTokenExpired?: () => void;

        /**
         *  If a user deselects a held seat, a release request is sent to the seats.io server.
         *
         *  If that API call executes successfully, onReleaseHoldSucceeded is invoked.
         *
         *  @see https://docs.seats.io/docs/renderer-events-onreleaseholdsucceeded
         */
        onReleaseHoldSucceeded?: (objects: BookableObject[], ticketTypes?: { price: number; ticketType?: string; label?: string; }[]) => void;

        /**
         *  @deprecated
         *
         *  📘 This parameter is deprecated. Use `onReleaseHoldSucceeded` instead.
         */
        onUnreservationSucceeded?: never;

        /**
         *  If a user deselects a held seat, a release request is sent to the seats.io server.
         *
         *  If that call fails, onReleaseHoldFailed is invoked.
         *
         *  @see https://docs.seats.io/docs/renderer-events-onreleaseholdfailed
         */
        onReleaseHoldFailed?: (objects: BookableObject[], ticketTypes?: { price: number; ticketType?: string; label?: string; }[]) => void;

        /**
         *  @deprecated
         *
         *  📘 This parameter is deprecated. Use `onReleaseHoldFailed` instead.
         */
        onUnreservationFailed?: never;

        /**
         *  Triggered when one or more selectionValidators are passed in, and the selection is valid.
         *
         *  To be used in combination with onSelectionInvalid.
         *
         *  @see https://docs.seats.io/docs/renderer-events-onselectionvalid
         */
        onSelectionValid?: () => void;

        /**
         *  Triggered when one or more selectionValidators are passed in, and the selection is invalid.
         *
         *  You should use this callback to prevent a ticket buyer from submitting
         *  the ticketing form, and to show a warning message.
         *
         *  @see https://docs.seats.io/docs/renderer-events-onselectioninvalid
         */
        onSelectionInvalid?: (violations: Violations[]) => void;

        /**
         *  Triggered when the chart switches to full screen mode.
         *
         *  @see https://docs.seats.io/docs/renderer-events-onfullscreenopened
         */
        onFullScreenOpened?: () => void;

        /**
         *  Triggered when the chart leaves full screen mode.
         *
         *  @see https://docs.seats.io/docs/renderer-events-onfullscreenclosed
         */
        onFullScreenClosed?: () => void;

        /**
         *  Unknown
         *
         *  @todo
         */
        previewImage?: boolean;

    }

    /**
     *  The expected (and optional) settings for constructing a new SeatingChart object.
     */
    export interface Config extends OriginalConfig {
        divId: string | 'chart';
        workspaceKey: string;
    }

    /**
     *  Most event handling functions take a bookable object
     *  (i.e. a seat, a table, a booth) as a parameter,
     *  for example when a user clicks a seat.
     *
     *  🕑
     *  If your account was created before May 15th 2019,
     *  and unifiedObjectPropertiesInCallbacks property is not set to true,
     *  you may notice slight differences between callbacks executed
     *  inside the seats.io iFrame and outside the iFrame.
     *
     *  Old accounts can override this behavior using unifiedObjectPropertiesInCallbacks flag.
     */
    export interface BaseObject {

        /**
         *  true if either the object or its category is marked as accessible in the designer.
         *
         *  🕑
         *  If your account was created before May 15th 2019!
         *
         *  For callbacks executed inside the iframe,
         *  if a seat is made accessible through its category,
         *  object.accessible would be set to false.
         *
         *  @see https://docs.seats.io/docs/objectaccessible
         */
        accessible: boolean;

        /**
         *  @see https://docs.seats.io/docs/renderer-object-properties-objectcategory
         */
        category: Category;

        /**
         *  @see https://docs.seats.io/docs/renderer-object-properties-objectcenter
         */
        center: { x: number, y: number };

        /**
         *  @see https://docs.seats.io/docs/renderer-object-properties-objectlabel
         */
        label: string;

        /**
         *  The object label split into different parts.
         *
         *  It contains the label of the object itself,
         *  the label of its parent (i.e. a table or row),
         *  and the section label if applicable.
         *
         *  @see https://docs.seats.io/docs/renderer-object-properties-objectlabels
         */
        labels: {
            own: string;
            parent?: string;
            section?: string;
        };

        /**
         *  @see https://docs.seats.io/docs/renderer-object-properties-objectpricing
         */
        pricing: Pricing[] | Pricing;

        /**
         *  📘 Custom values possible
         *
         *  @see https://docs.seats.io/docs/renderer-object-properties-objectstatus
         */
        status: 'free' | 'reservedByToken' | 'booked' | string;

        /**
         *  @see https://docs.seats.io/docs/renderer-object-properties-objectextradata
         */
        extraData: any; // TODO More specific type??

        /**
         *  The status and extra data for an object, per event.
         *
         *  Useful when you pass in multiple events when rendering a chart.
         *
         *  @see https://docs.seats.io/docs/renderer-object-properties-object-dataperevent
         */
        dataPerEvent: { [eventKey: string]: DataPerEvent };

        /**
         *  @see https://docs.seats.io/docs/renderer-object-properties-objectforsale
         */
        forSale: boolean;

        /**
         *  Whether the object can be selected by the user.
         *
         *  📘
         *  Notice:
         *  Does not take into account if an object is marked as for sale or not for sale.
         *  You can still check that separately by checking `forSale`
         *
         *  @see https://docs.seats.io/docs/renderer-object-properties-objectselectable
         */
        selectable: boolean;

        /**
         *  true if the object is selected by the user
         *
         *  @see https://docs.seats.io/docs/renderer-object-properties-objectselected
         */
        selected: boolean;

        /**
         *  The name of the ticket type the user selected.
         *
         *  @todo Is this property optional?? What is the value when nothing selected / no ticket types
         *
         *  @see https://docs.seats.io/docs/renderer-object-properties-objectselectedtickettype
         */
        selectedTicketType: string;

        /**
         *  true if the object belongs to an active channel.
         *
         *  Or to no channel, when channels are not being used for this event.
         *
         *  @see https://docs.seats.io/docs/renderer-object-properties-inselectablechannel
         */
        inSelectableChannel: boolean;

        /**
         *  Selects the object, as if the user clicked on it.
         *
         *  @see https://docs.seats.io/docs/renderer-object-properties-objectselect
         */
        select(ticketType?: string): void;

        /**
         *  Deselects a selected object.
         *
         *  @see https://docs.seats.io/docs/renderer-object-properties-objectdeselect
         */
        deselect(): void;

        /**
         *  Shows a visual pulsing animation around the seat.
         *
         *  🚧 Note: Only seats can be pulsed. Calling .pulse() on other objects will not have any effect.
         *
         *  @see https://docs.seats.io/docs/renderer-object-properties-objectpulse
         */
        pulse(): void;

        /**
         *  Stops the pulse effect.
         *
         *  @see https://docs.seats.io/docs/renderer-object-properties-objectunpulse
         */
        unpulse(): void;

        /**
         *  The displayed object type for rows and seats, if specified in the designer.
         *
         *  @see https://docs.seats.io/docs/objectdisplayobjecttype
         */
        displayObjectType: 'Seat' | 'Chair' | 'Stool' | 'Bench' | string;

    }

    export interface SeatObject extends BaseObject {

        /**
         *  @see https://docs.seats.io/docs/renderer-object-properties-objectobjecttype
         */
        objectType: 'Seat';

        /**
         *  Information about a seats' parent.
         *
         *  @see https://docs.seats.io/docs/seatparent
         */
        parent: { type: 'row' | 'table' };

        /**
         *  The URL of the image if the seat has a "view from your seat" image set.
         *
         *  @see https://docs.seats.io/docs/seatviewfromseaturl
         */
        viewFromSeatUrl?: string;

        /**
         *  Indicates if a seat is a companion seat.
         *
         *  This property can be set through the designer and it is used
         *  in conjunction with the accessibility property.
         *
         *  @see https://docs.seats.io/docs/seatcompanionseat
         */
        companionSeat: boolean;

        /**
         *  Indicates if a seat has restricted view.
         *
         *  @see https://docs.seats.io/docs/seatrestrictedview
         */
        restrictedView: boolean;

        /**
         *  Whether this seat is disabled by social distancing rules.
         *
         *  🕑
         *  Make sure that unifiedObjectPropertiesInCallbacks is enabled
         *  to use this property from in-iFrame callbacks.
         *
         *  @see https://docs.seats.io/docs/renderer-seat-properties-disabledbysocialdistancingrules
         */
        disabledBySocialDistancingRules: boolean;

    }

    export interface BoothObject extends BaseObject {

        /**
         *  @see https://docs.seats.io/docs/renderer-object-properties-objectobjecttype
         */
        objectType: 'Booth';

    }

    export interface TableObject extends BaseObject {

        /**
         *  @see https://docs.seats.io/docs/renderer-object-properties-objectobjecttype
         */
        objectType: 'Table';

    }

    export interface GeneralAdmissionObject extends BaseObject {

        /**
         *  @see https://docs.seats.io/docs/renderer-object-properties-objectobjecttype
         */
        objectType: 'GeneralAdmissionArea';

        /**
         *  The initial total number of available places in the general admission area.
         *
         *  Does not take booked places into account.
         *
         *  @see https://docs.seats.io/docs/renderer-object-properties-ga-capacity
         */
        capacity: number;

        /**
         *  The total number of booked places in the GA area.
         *
         *  Equal to capacity - numFree.
         *
         *  @see https://docs.seats.io/docs/renderer-object-properties-ga-numbooked
         */
        numBooked: number;

        /**
         *  The total number of free places in the GA area.
         *
         *  Equal to capacity - numBooked.
         *
         *  @see https://docs.seats.io/docs/renderer-object-properties-ga-numfree
         */
        numFree: number;

        /**
         *  The total number of places the user selected in the GA area.
         *
         *  If there are multiple ticket types,
         *  numSelected is equal to the sum of all selections per ticket type.
         *
         *  @see https://docs.seats.io/docs/renderer-object-properties-ge-numselected
         */
        numSelected: number;

        /**
         *  The number of selected places in a GA area, per ticket type.
         *
         *  @see https://docs.seats.io/docs/renderer-object-properties-ga-selection-per-ticket-type
         */
        selectionPerTicketType: { [ticketType: string]: number };

        /**
         *  dataPerEvent
         *
         *  @see https://docs.seats.io/docs/renderer-object-properties-ga-dataperevent
         */
        dataPerEvent: { [eventKey: string]: GeneralAdmissionDataPerEvent };

        /**
         *  Deselects a selected object.
         *
         *  @see https://docs.seats.io/docs/renderer-object-properties-objectdeselect
         */
        deselect(ticketType?: string): never;

    }

    export interface SectionObject extends BaseObject {

        /**
         *  @see https://docs.seats.io/docs/renderer-object-properties-sectionobjecttype
         */
        objectType: 'Section';

        /**
         *  @see https://docs.seats.io/docs/renderer-object-properties-sectionsectioncategory
         */
        sectionCategory: Category;

        /**
         *  @see https://docs.seats.io/docs/renderer-object-properties-sectionlabel
         */
        label: string;

        /**
         *  The number of objects in the section that are selectable
         *
         *  Typically the number of non-booked objects
         *
         *  @see https://docs.seats.io/docs/renderer-object-properties-sectionnumberofselectableobjects
         */
        numberOfSelectableObjects: number;

        /**
         *  The number of objects in the section that are selected by the user
         *
         *  @see https://docs.seats.io/docs/renderer-object-properties-sectionnumberofselectedobjects
         */
        numberOfSelectedObjects: number;

        /**
         *  Array that contains all the (unique) categories for the selectable objects in the section.
         *
         *  @see https://docs.seats.io/docs/renderer-object-properties-sectionselectablecategories
         */
        selectableCategories: Category[];

        /**
         *  An interactive section reacts to mouse hovers by changing color and showing a tooltip.
         *
         *  This is determined by the zoom level:
         *  when a chart is zoomed out, sections are interactive.
         *  When a user clicks on a section, the chart zooms in,
         *  and the sections are not interactive anymore.
         *  Instead the individual objects become interactive.
         *
         *  @see https://docs.seats.io/docs/renderer-object-properties-sectionisinteractive
         */
        isInteractive: boolean;

    }

    export type BookableObject = SeatObject | BoothObject | TableObject | GeneralAdmissionObject | SectionObject;

    /**
     *  The values associated with a category
     */
    export interface Category {
        accessible: boolean;
        color: string;
        key: number;
        label: string;
        pricing: Pricing;
    }

    /**
     *  The (input) properties for a category
     */
    export interface CategoryConfig {
        accessible?: boolean;
        color: string;
        key: number;
        label: string;
    }

    /**
     *  The categories list has a method allowing easy retrieval of a category
     */
    export interface CategoryList extends Array<Category> {
        get(key: string): Category;
    }

    /**
     *  Pricing object
     */
    export interface Pricing {
        price: number;
        formattedPrice: string;
        ticketType?: string;
    }

    /**
     *  Pricing object for either simple or multi level pricing configurations
     */
    export interface PricingConfig {
        category: string | number;
        price?: number;
        ticketTypes?: {
            ticketType: string;
            price: number;
            label?: string;
        }[];
    }

    /**
     *  Pricing object for simple pricing configurations
     */
    export interface PricingConfigSimple {
        category: string | number;
        price: number;
    }

    /**
     *  Pricing object for multi level pricing configurations
     */
    export interface PricingConfigMulti {
        category: string | number;
        ticketTypes: {
            ticketType: string;
            price: number;
            label?: string;
        }[];
    }

    /**
     *  The status for a bookable object, per event.
     */
    export interface DataPerEvent {
        status: 'free' | 'reservedByToken' | 'booked' | string;
        extraData?: any; // TODO More specific type?
    }

    /**
     *  The status for a GA area, per event.
     *  Useful when you pass in multiple events when rendering a chart.
     */
    export interface GeneralAdmissionDataPerEvent extends DataPerEvent {
        numBooked: 5;
        holds: {
            [tokenHash: string]: {
                NO_TICKET_TYPE: number;
                [ticketType: string]: number;
            };
        };
    }

    /**
     *  🚧 Do not use this config param if you expect high load on-sales
     *
     *  @see https://docs.seats.io/docs/renderer-config-selectbestavailable
     */
    export interface BestAvailable {
        number?: number;
        category: string | string[];
        ticketTypes: { [ticketType: string]: number };
        clearSelection: boolean
    }

    /**
     *  Some callbacks (e.g. objectLabel) do not have access to variables defined in your web page.
     *  That's because they're executed inside the seats.io iFrame.
     *
     *  With extraConfig, you can pass in an object to which the callbacks do have access.
     *  It's passed to them as the last parameter.
     *
     *  @see https://docs.seats.io/docs/renderer-config-extraconfig
     */
    export interface ExtraConfig { [key: string]: any }

    /**
     *  The ticketListings parameter is useful when you're selling tickets
     *  for which you only know the section name, but not the exact row or the seat.
     */
    export interface TicketListing {
        section: string;
        quantity: number;
        price: number;
    }

    export type SelectionValidator = {
        type: 'noOrphanSeats';
        mode?: 'lenient' | 'strict';
        enabled?: boolean;
        highlight?: boolean;
    } | {
        type: 'consecutiveSeats';
    };

    export type Violations = 'noOrphanSeats' | 'consecutiveSeats';

}

export default seatsio;
