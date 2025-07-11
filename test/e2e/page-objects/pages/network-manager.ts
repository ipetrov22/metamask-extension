import { Driver } from '../../webdriver/driver';

class NetworkManager {
  protected readonly driver: Driver;

  private readonly networkManagerToggle = '[data-testid="sort-by-networks"]';

  private readonly networkManagerCloseButton =
    '[data-testid="modal-header-close-button"]';

  private readonly networkListItem = (networkName: string) =>
    `[data-testid="network-list-item-${networkName}"]`;

  private readonly networkCheckbox = (networkName: string) =>
    `[data-testid="network-list-item-${networkName}"] input[type="checkbox"]`;

  private readonly tabList = '.tabs__list.network-manager__tab-list';

  constructor(driver: Driver) {
    this.driver = driver;
  }

  // select a network from the manager list
  async openNetworkManager(): Promise<void> {
    console.log(`Opening the network manager`);
    await this.driver.clickElement(this.networkManagerToggle);
  }

  async closeNetworkManager(): Promise<void> {
    console.log(`Closing the network manager`);
    await this.driver.clickElement(this.networkManagerCloseButton);
  }

  async selectTab(tabName: string): Promise<void> {
    console.log(`Selecting tab: ${tabName}`);
    await this.driver.clickElement({
      text: tabName,
    });
  }

  // Method to select/click on a network item
  async selectNetwork(networkName: string): Promise<void> {
    console.log(`Selecting network: ${networkName}`);
    await this.checkNetworkIsDeselected(networkName);
    await this.driver.clickElementSafe(this.networkListItem(networkName));
  }

  async deselectNetwork(networkName: string): Promise<void> {
    console.log(`Deselecting network: ${networkName}`);
    await this.checkNetworkIsSelected(networkName);
    await this.driver.clickElementSafe(this.networkListItem(networkName));
  }

  // Method to check if a network is currently selected/active
  async checkNetworkIsSelected(networkName: string): Promise<void> {
    console.log(`Checking if network is selected: ${networkName}`);
    const checkbox = await this.driver.waitForSelector(
      this.networkCheckbox(networkName),
    );
    const isChecked = await checkbox.isSelected();
    if (!isChecked) {
      throw new Error(
        `Network ${networkName} is not selected (checkbox not checked)`,
      );
    }
    console.log(`Network ${networkName} is properly selected`);
  }

  async checkCustomNetworkIsSelected(caipChainId: string) {
    const selector = `[data-testid="network-list-item-${caipChainId}"].multichain-network-list-item--selected`;
    await this.driver.waitForSelector(selector);

    // Additional verification: ensure the selected indicator is present
    const indicatorSelector = `[data-testid="network-list-item-${caipChainId}"] .multichain-network-list-item__selected-indicator`;
    await this.driver.waitForSelector(indicatorSelector);

    console.log(
      `Custom network ${caipChainId} is properly selected with background indication`,
    );
  }

  async checkNetworkIsDeselected(networkName: string): Promise<void> {
    console.log(`Checking if network is deselected: ${networkName}`);
    const checkbox = await this.driver.waitForSelector(
      this.networkCheckbox(networkName),
    );
    const isChecked = await checkbox.isSelected();
    if (isChecked) {
      throw new Error(
        `Network ${networkName} is still selected (checkbox is checked)`,
      );
    }
    console.log(`Network ${networkName} is properly deselected`);
  }

  async checkTabIsSelected(tabName: string): Promise<void> {
    console.log(`Checking if ${tabName} tab is selected`);
    // Find the active tab and verify it contains "Custom" text
    await this.driver.waitForSelector({
      css: `${this.tabList} li.tab--active button`,
      text: tabName,
    });
    console.log(`${tabName} tab is properly selected`);
  }
}

export default NetworkManager;
