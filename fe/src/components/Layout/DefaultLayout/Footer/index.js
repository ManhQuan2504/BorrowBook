import React from 'react';
import { Container, Grid, Segment } from 'semantic-ui-react';
import './Footer.scss'; // Import file for additional styles

function Footer() {
	return (
		<Segment inverted vertical className='fixed-footer'>
			<Container>
				<Grid divided inverted stackable>
					<Grid.Row>
						<Grid.Column width={4}>
							<h4>About Us</h4>
							<p>Your company information goes here.</p>
						</Grid.Column>
						<Grid.Column width={4}>
							<h4>Contact</h4>
							<p>Your contact information goes here.</p>
						</Grid.Column>
						<Grid.Column width={4}>
							<h4>Links</h4>
							<p>Your links or additional information goes here.</p>
						</Grid.Column>
						<Grid.Column width={4}>
							<h4>Social Media</h4>
							<p>Your social media links or information goes here.</p>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Container>
		</Segment>
	);
}

export default Footer;
