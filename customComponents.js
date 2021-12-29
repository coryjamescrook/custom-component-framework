class TextContent extends BaseComponent {
  constructor() {
    super();

    this.registerProps({
      propName: "text",
      propType: TextContent.PropTypes.STRING
    });
  }

  render() {
    return `<p>${this.text}</p>`;
  }
}
customElements.define("text-content", TextContent);

class CountdownMessage extends BaseComponent {
  constructor() {
    super();

    this.registerProps(
      {
        propName: "from",
        propType: CountdownMessage.PropTypes.INTEGER
      },
      {
        propName: "interval",
        propType: CountdownMessage.PropTypes.INTEGER,
        optional: true,
        defaultGetter: () => 1000
      },
      {
        propName: "message",
        propType: CountdownMessage.PropTypes.STRING,
        optional: true,
        defaultGetter: () => "Blast off!"
      }
    );

    const intervalHandler = () => {
      if (this.state.currentCount > 0) {
        this.setState({
          currentCount: this.state.currentCount - 1
        });
      } else {
        cleanupInterval();
      }
    };

    const cleanupInterval = () => {
      clearInterval(intervalHandler);
    };

    setInterval(intervalHandler, this.interval);

    this.setState({ currentCount: this.from });
  }

  render() {
    const content =
      this.state.currentCount < 1
        ? this.message
        : `Countdown: ${this.state.currentCount} seconds...`;

    return `<p>${content}</p>`;
  }
}
customElements.define("countdown-message", CountdownMessage);
